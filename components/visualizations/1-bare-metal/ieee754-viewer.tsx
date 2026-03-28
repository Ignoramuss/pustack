"use client";

import { useState, useCallback, useMemo } from "react";

function floatToBits(value: number): boolean[] {
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setFloat32(0, value);
  const int = new DataView(buffer).getUint32(0);
  const bits: boolean[] = [];
  for (let i = 31; i >= 0; i--) {
    bits.push(((int >> i) & 1) === 1);
  }
  return bits;
}

function bitsToFloat(bits: boolean[]): number {
  let int = 0;
  for (let i = 0; i < 32; i++) {
    if (bits[i]) {
      int |= 1 << (31 - i);
    }
  }
  const buffer = new ArrayBuffer(4);
  new DataView(buffer).setUint32(0, int >>> 0);
  return new DataView(buffer).getFloat32(0);
}

type Section = "sign" | "exponent" | "mantissa";

function getSection(index: number): Section {
  if (index === 0) return "sign";
  if (index < 9) return "exponent";
  return "mantissa";
}

const SECTION_COLORS: Record<Section, { on: string; off: string; label: string }> = {
  sign: { on: "#ef4444", off: "#7f1d1d", label: "#ef4444" },
  exponent: { on: "#3b82f6", off: "#1e3a5f", label: "#3b82f6" },
  mantissa: { on: "#22c55e", off: "#14532d", label: "#22c55e" },
};

export function Ieee754Viewer(): React.ReactElement {
  const [bits, setBits] = useState<boolean[]>(() => floatToBits(0.15625));

  const floatValue = useMemo(() => bitsToFloat(bits), [bits]);

  const handleToggle = useCallback((index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const handleFloatInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value);
      if (!isNaN(parsed)) {
        setBits(floatToBits(parsed));
      }
    },
    []
  );

  const sign = bits[0] ? 1 : 0;
  const exponentBits = bits.slice(1, 9);
  const exponentValue = exponentBits.reduce((acc, b, i) => acc + (b ? 1 << (7 - i) : 0), 0);
  const mantissaBits = bits.slice(9);

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold">IEEE 754 Single Precision (32-bit)</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Click bits to toggle. <span style={{ color: "#ef4444" }}>Sign (1)</span>{" "}
        <span style={{ color: "#3b82f6" }}>Exponent (8)</span>{" "}
        <span style={{ color: "#22c55e" }}>Mantissa (23)</span>
      </p>

      {/* Bit grid */}
      <div className="flex flex-wrap gap-0.5 justify-center">
        {bits.map((on, i) => {
          const section = getSection(i);
          const colors = SECTION_COLORS[section];
          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className="w-7 h-8 rounded-sm font-mono text-xs font-bold transition-colors duration-100 cursor-pointer"
              style={{
                background: on ? colors.on : colors.off,
                color: on ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {on ? "1" : "0"}
            </button>
          );
        })}
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-mono">
        <div className="rounded-md p-3" style={{ background: "var(--color-bg)", border: "1px solid #7f1d1d" }}>
          <div className="text-xs mb-1" style={{ color: "#ef4444" }}>
            Sign
          </div>
          <div>{sign} → {sign === 0 ? "+" : "−"}</div>
        </div>
        <div className="rounded-md p-3" style={{ background: "var(--color-bg)", border: "1px solid #1e3a5f" }}>
          <div className="text-xs mb-1" style={{ color: "#3b82f6" }}>
            Exponent
          </div>
          <div>
            {exponentValue} − 127 = {exponentValue - 127}
          </div>
        </div>
        <div className="rounded-md p-3" style={{ background: "var(--color-bg)", border: "1px solid #14532d" }}>
          <div className="text-xs mb-1" style={{ color: "#22c55e" }}>
            Mantissa
          </div>
          <div>
            1.
            {mantissaBits
              .slice(0, 10)
              .map((b) => (b ? "1" : "0"))
              .join("")}
            …
          </div>
        </div>
      </div>

      {/* Float value */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          Float value:
        </label>
        <input
          type="text"
          defaultValue={floatValue.toString()}
          onBlur={handleFloatInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFloatInput(e as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
          className="flex-1 rounded-md px-3 py-2 font-mono text-sm"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      {/* Formula */}
      <div
        className="text-center text-sm font-mono p-2 rounded-md"
        style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}
      >
        (−1)<sup>{sign}</sup> × 2<sup>{exponentValue - 127}</sup> × (1 + mantissa) ={" "}
        <strong style={{ color: "var(--color-text)" }}>
          {Number.isFinite(floatValue) ? floatValue : floatValue.toString()}
        </strong>
      </div>
    </div>
  );
}
