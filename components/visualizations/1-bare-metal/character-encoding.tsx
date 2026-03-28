"use client";

import { useState, useCallback, useMemo } from "react";

function charToUtf8Bytes(char: string): number[] {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(char));
}

function byteToBinary(byte: number): string {
  return byte.toString(2).padStart(8, "0");
}

type EncodingEntry = {
  char: string;
  codePoint: number;
  ascii: number | null;
  utf8Bytes: number[];
};

function analyzeString(str: string): EncodingEntry[] {
  const entries: EncodingEntry[] = [];
  for (const char of str) {
    const codePoint = char.codePointAt(0) ?? 0;
    entries.push({
      char,
      codePoint,
      ascii: codePoint < 128 ? codePoint : null,
      utf8Bytes: charToUtf8Bytes(char),
    });
  }
  return entries;
}

export function CharacterEncoding(): React.ReactElement {
  const [input, setInput] = useState("Hello 🌍!");
  const entries = useMemo(() => analyzeString(input), [input]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold">ASCII / UTF-8 Character Encoding</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Type a string to see how each character is encoded in ASCII and UTF-8.
        Multi-byte characters show their full UTF-8 byte sequence.
      </p>

      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type something..."
        className="w-full rounded-md px-3 py-2 font-mono text-sm"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      />

      {/* Character table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr style={{ color: "var(--color-text-muted)" }}>
              <th className="text-left py-2 pr-4">Char</th>
              <th className="text-left py-2 pr-4">Code Point</th>
              <th className="text-left py-2 pr-4">ASCII</th>
              <th className="text-left py-2">UTF-8 Bytes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr
                key={i}
                className="border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="py-2 pr-4 text-lg">{entry.char}</td>
                <td className="py-2 pr-4" style={{ color: "var(--color-accent)" }}>
                  U+{entry.codePoint.toString(16).toUpperCase().padStart(4, "0")}
                </td>
                <td className="py-2 pr-4">
                  {entry.ascii !== null ? (
                    <span>{entry.ascii} ({byteToBinary(entry.ascii)})</span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)" }}>—</span>
                  )}
                </td>
                <td className="py-2">
                  <div className="flex gap-1 flex-wrap">
                    {entry.utf8Bytes.map((byte, j) => (
                      <span
                        key={j}
                        className="inline-block rounded px-1.5 py-0.5 text-xs"
                        style={{
                          background:
                            entry.utf8Bytes.length === 1
                              ? "var(--color-bit-on)"
                              : entry.utf8Bytes.length === 2
                                ? "#3b82f6"
                                : entry.utf8Bytes.length === 3
                                  ? "#a855f7"
                                  : "#ef4444",
                          color: "#fff",
                        }}
                      >
                        {byteToBinary(byte)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span>
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: "var(--color-bit-on)" }} />
          1 byte (ASCII)
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: "#3b82f6" }} />
          2 bytes
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: "#a855f7" }} />
          3 bytes
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: "#ef4444" }} />
          4 bytes
        </span>
      </div>

      {/* Total bytes */}
      <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Total: {entries.reduce((acc, e) => acc + e.utf8Bytes.length, 0)} bytes for{" "}
        {entries.length} character{entries.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
