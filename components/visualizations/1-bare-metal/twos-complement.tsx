"use client";

import { useState, useCallback } from "react";

const BITS = 8;
const MAX_SIGNED = (1 << (BITS - 1)) - 1; // 127
const MIN_SIGNED = -(1 << (BITS - 1)); // -128

function toSignedValue(unsigned: number): number {
  if (unsigned >= 1 << (BITS - 1)) {
    return unsigned - (1 << BITS);
  }
  return unsigned;
}

function toUnsigned(signed: number): number {
  if (signed < 0) {
    return signed + (1 << BITS);
  }
  return signed;
}

function toBits(unsigned: number): boolean[] {
  const bits: boolean[] = [];
  for (let i = BITS - 1; i >= 0; i--) {
    bits.push(((unsigned >> i) & 1) === 1);
  }
  return bits;
}

function fromBits(bits: boolean[]): number {
  let value = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      value |= 1 << (bits.length - 1 - i);
    }
  }
  return value;
}

export function TwosComplement(): React.ReactElement {
  const [unsigned, setUnsigned] = useState(0);
  const signed = toSignedValue(unsigned);
  const bits = toBits(unsigned);

  const handleToggle = useCallback((index: number) => {
    setUnsigned((prev) => {
      const b = toBits(prev);
      b[index] = !b[index];
      return fromBits(b);
    });
  }, []);

  const handleSignedInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIGNED && parsed <= MAX_SIGNED) {
        setUnsigned(toUnsigned(parsed));
      } else if (e.target.value === "" || e.target.value === "-") {
        setUnsigned(0);
      }
    },
    []
  );

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold">Two&apos;s Complement (8-bit)</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        The MSB (leftmost bit) is the sign bit. Negative numbers are stored by flipping all bits
        and adding 1.
      </p>

      {/* Bit display */}
      <div className="flex items-center gap-1 justify-center">
        {bits.map((on, i) => (
          <button
            key={i}
            onClick={() => handleToggle(i)}
            className="w-12 h-12 rounded-md font-mono text-lg font-bold transition-colors duration-150 cursor-pointer border-2"
            style={{
              background:
                i === 0
                  ? on
                    ? "#ef4444"
                    : "var(--color-bit-off)"
                  : on
                    ? "var(--color-bit-on)"
                    : "var(--color-bit-off)",
              borderColor:
                i === 0
                  ? on
                    ? "#ef4444"
                    : "var(--color-border)"
                  : on
                    ? "var(--color-bit-on)"
                    : "var(--color-border)",
              color: on ? (i === 0 ? "#fff" : "#000") : "var(--color-text-muted)",
            }}
          >
            {on ? "1" : "0"}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex gap-1 justify-center">
        <span
          className="w-12 text-center text-xs font-mono"
          style={{ color: "#ef4444" }}
        >
          sign
        </span>
        {bits.slice(1).map((_, i) => (
          <span
            key={i}
            className="w-12 text-center text-xs font-mono"
            style={{ color: "var(--color-text-muted)" }}
          >
            2<sup>{BITS - 2 - i}</sup>
          </span>
        ))}
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Signed Value
          </label>
          <input
            type="text"
            value={signed.toString()}
            onChange={handleSignedInput}
            className="w-full rounded-md px-3 py-2 font-mono text-sm"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: signed < 0 ? "#ef4444" : "var(--color-text)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Unsigned Value
          </label>
          <div
            className="rounded-md px-3 py-2 font-mono text-sm"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {unsigned}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {signed < 0 && (
        <div
          className="rounded-md p-3 text-sm font-mono"
          style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            Invert: {toBits(unsigned).map((b) => (b ? "0" : "1")).join("")} →{" "}
            {(~unsigned & 0xff).toString(10)} + 1 = {toUnsigned(signed).toString(10)} (unsigned)
            = {signed} (signed)
          </p>
        </div>
      )}
    </div>
  );
}
