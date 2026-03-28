"use client";

import { useState, useCallback } from "react";

const BITS = 8;

function toBinaryArray(value: number): boolean[] {
  const bits: boolean[] = [];
  for (let i = BITS - 1; i >= 0; i--) {
    bits.push(((value >> i) & 1) === 1);
  }
  return bits;
}

function fromBinaryArray(bits: boolean[]): number {
  let value = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      value |= 1 << (bits.length - 1 - i);
    }
  }
  return value;
}

function BitCell({
  on,
  index,
  onToggle,
}: {
  on: boolean;
  index: number;
  onToggle: (index: number) => void;
}): React.ReactElement {
  return (
    <button
      onClick={() => onToggle(index)}
      className="w-12 h-12 rounded-md font-mono text-lg font-bold transition-colors duration-150 cursor-pointer border-2"
      style={{
        background: on ? "var(--color-bit-on)" : "var(--color-bit-off)",
        borderColor: on ? "var(--color-bit-on)" : "var(--color-border)",
        color: on ? "#000" : "var(--color-text-muted)",
      }}
    >
      {on ? "1" : "0"}
    </button>
  );
}

export function BinaryConverter(): React.ReactElement {
  const [value, setValue] = useState(0);
  const bits = toBinaryArray(value);

  const handleToggle = useCallback((index: number) => {
    setValue((prev) => {
      const currentBits = toBinaryArray(prev);
      currentBits[index] = !currentBits[index];
      return fromBinaryArray(currentBits);
    });
  }, []);

  const handleDecimalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 255) {
        setValue(parsed);
      } else if (e.target.value === "") {
        setValue(0);
      }
    },
    []
  );

  const handleHexChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value, 16);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 255) {
        setValue(parsed);
      } else if (e.target.value === "") {
        setValue(0);
      }
    },
    []
  );

  const handleOctalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value, 8);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 255) {
        setValue(parsed);
      } else if (e.target.value === "") {
        setValue(0);
      }
    },
    []
  );

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold">Binary / Hex / Decimal Converter</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Click individual bits to toggle them and watch values update across all representations.
      </p>

      {/* Bit toggles */}
      <div>
        <div className="flex items-center gap-1 justify-center mb-2">
          {bits.map((on, i) => (
            <BitCell key={i} on={on} index={i} onToggle={handleToggle} />
          ))}
        </div>
        <div className="flex gap-1 justify-center">
          {bits.map((_, i) => (
            <span
              key={i}
              className="w-12 text-center text-xs font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              2<sup>{BITS - 1 - i}</sup>
            </span>
          ))}
        </div>
      </div>

      {/* Numeric representations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField label="Decimal" value={value.toString(10)} onChange={handleDecimalChange} />
        <NumberField
          label="Hexadecimal"
          value={"0x" + value.toString(16).toUpperCase().padStart(2, "0")}
          onChange={handleHexChange}
          prefix="0x"
        />
        <NumberField
          label="Octal"
          value={"0o" + value.toString(8).padStart(3, "0")}
          onChange={handleOctalChange}
          prefix="0o"
        />
      </div>

      {/* Binary string */}
      <div className="text-center font-mono text-lg tracking-widest">
        <span style={{ color: "var(--color-text-muted)" }}>0b</span>
        {value.toString(2).padStart(BITS, "0")}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
}): React.ReactElement {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </label>
      <input
        type="text"
        value={prefix ? value.slice(prefix.length) : value}
        onChange={onChange}
        className="w-full rounded-md px-3 py-2 font-mono text-sm"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      />
    </div>
  );
}
