"use client";

import { useState, useCallback } from "react";

type GateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR";

type GateDefinition = {
  name: GateType;
  description: string;
  inputCount: number;
  evaluate: (inputs: boolean[]) => boolean;
  booleanExpr: string;
  truthTable: { inputs: boolean[]; output: boolean }[];
};

const GATE_DEFINITIONS: GateDefinition[] = [
  {
    name: "AND",
    description: "Output is 1 only when ALL inputs are 1.",
    inputCount: 2,
    evaluate: (inputs) => inputs[0] && inputs[1],
    booleanExpr: "A \u00B7 B",
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: true },
    ],
  },
  {
    name: "OR",
    description: "Output is 1 when ANY input is 1.",
    inputCount: 2,
    evaluate: (inputs) => inputs[0] || inputs[1],
    booleanExpr: "A + B",
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: true },
    ],
  },
  {
    name: "NOT",
    description: "Output is the inverse of the input.",
    inputCount: 1,
    evaluate: (inputs) => !inputs[0],
    booleanExpr: "\u00ACA",
    truthTable: [
      { inputs: [false], output: true },
      { inputs: [true], output: false },
    ],
  },
  {
    name: "XOR",
    description: "Output is 1 when inputs are DIFFERENT.",
    inputCount: 2,
    evaluate: (inputs) => inputs[0] !== inputs[1],
    booleanExpr: "A \u2295 B",
    truthTable: [
      { inputs: [false, false], output: false },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
  },
  {
    name: "NAND",
    description: "Output is 0 only when ALL inputs are 1. (Inverse of AND)",
    inputCount: 2,
    evaluate: (inputs) => !(inputs[0] && inputs[1]),
    booleanExpr: "\u00AC(A \u00B7 B)",
    truthTable: [
      { inputs: [false, false], output: true },
      { inputs: [false, true], output: true },
      { inputs: [true, false], output: true },
      { inputs: [true, true], output: false },
    ],
  },
  {
    name: "NOR",
    description: "Output is 1 only when ALL inputs are 0. (Inverse of OR)",
    inputCount: 2,
    evaluate: (inputs) => !(inputs[0] || inputs[1]),
    booleanExpr: "\u00AC(A + B)",
    truthTable: [
      { inputs: [false, false], output: true },
      { inputs: [false, true], output: false },
      { inputs: [true, false], output: false },
      { inputs: [true, true], output: false },
    ],
  },
];

function GateSymbol({
  type,
  inputs,
  output,
}: {
  type: GateType;
  inputs: boolean[];
  output: boolean;
}): React.ReactElement {
  const w = 120;
  const h = 80;
  const inputLabels = type === "NOT" ? ["A"] : ["A", "B"];

  return (
    <svg width={w + 80} height={h + 20} viewBox={`0 0 ${w + 80} ${h + 20}`}>
      {/* Input wires */}
      {inputLabels.map((label, i) => {
        const y = type === "NOT" ? h / 2 + 10 : 20 + i * (h - 20);
        return (
          <g key={label}>
            <line
              x1={0}
              y1={y}
              x2={30}
              y2={y}
              stroke={inputs[i] ? "var(--color-bit-on)" : "var(--color-border)"}
              strokeWidth={2}
            />
            <text
              x={4}
              y={y - 8}
              fontSize={11}
              fill="var(--color-text-muted)"
              fontFamily="monospace"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Gate body */}
      <rect
        x={30}
        y={5}
        width={w - 20}
        height={h + 10}
        rx={8}
        fill="var(--color-surface)"
        stroke={output ? "var(--color-bit-on)" : "var(--color-border)"}
        strokeWidth={2}
      />
      <text
        x={30 + (w - 20) / 2}
        y={h / 2 + 14}
        textAnchor="middle"
        fontSize={16}
        fontWeight="bold"
        fill="var(--color-text)"
        fontFamily="monospace"
      >
        {type}
      </text>

      {/* Bubble for NAND/NOR */}
      {(type === "NAND" || type === "NOR" || type === "NOT") && (
        <circle
          cx={w + 14}
          cy={h / 2 + 10}
          r={5}
          fill="var(--color-surface)"
          stroke={output ? "var(--color-bit-on)" : "var(--color-border)"}
          strokeWidth={2}
        />
      )}

      {/* Output wire */}
      <line
        x1={type === "NAND" || type === "NOR" || type === "NOT" ? w + 19 : w + 10}
        y1={h / 2 + 10}
        x2={w + 60}
        y2={h / 2 + 10}
        stroke={output ? "var(--color-bit-on)" : "var(--color-border)"}
        strokeWidth={2}
      />
      <text
        x={w + 50}
        y={h / 2 + 2}
        fontSize={11}
        fill="var(--color-text-muted)"
        fontFamily="monospace"
      >
        Q
      </text>
    </svg>
  );
}

function GateCard({ gate }: { gate: GateDefinition }): React.ReactElement {
  const [inputs, setInputs] = useState<boolean[]>(
    () => new Array(gate.inputCount).fill(false) as boolean[]
  );
  const output = gate.evaluate(inputs);

  const toggleInput = useCallback((index: number) => {
    setInputs((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  return (
    <div
      className="rounded-lg p-4 space-y-3"
      style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold font-mono">{gate.name}</h4>
        <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
          {gate.booleanExpr}
        </span>
      </div>

      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {gate.description}
      </p>

      {/* Interactive gate */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          {inputs.map((val, i) => (
            <button
              key={i}
              onClick={() => toggleInput(i)}
              className="w-10 h-10 rounded-md font-mono text-sm font-bold transition-colors duration-150 cursor-pointer border-2"
              style={{
                background: val ? "var(--color-bit-on)" : "var(--color-bit-off)",
                borderColor: val ? "var(--color-bit-on)" : "var(--color-border)",
                color: val ? "#000" : "var(--color-text-muted)",
              }}
            >
              {val ? "1" : "0"}
            </button>
          ))}
        </div>
        <GateSymbol type={gate.name} inputs={inputs} output={output} />
        <div
          className="w-10 h-10 rounded-md font-mono text-sm font-bold flex items-center justify-center border-2"
          style={{
            background: output ? "var(--color-bit-on)" : "var(--color-bit-off)",
            borderColor: output ? "var(--color-bit-on)" : "var(--color-border)",
            color: output ? "#000" : "var(--color-text-muted)",
          }}
        >
          {output ? "1" : "0"}
        </div>
      </div>

      {/* Truth table */}
      <details>
        <summary
          className="text-xs cursor-pointer"
          style={{ color: "var(--color-text-muted)" }}
        >
          Truth table
        </summary>
        <table className="mt-2 w-full text-xs font-mono">
          <thead>
            <tr>
              {gate.inputCount === 1 ? (
                <th className="text-left pb-1" style={{ color: "var(--color-text-muted)" }}>
                  A
                </th>
              ) : (
                <>
                  <th className="text-left pb-1" style={{ color: "var(--color-text-muted)" }}>
                    A
                  </th>
                  <th className="text-left pb-1" style={{ color: "var(--color-text-muted)" }}>
                    B
                  </th>
                </>
              )}
              <th className="text-left pb-1" style={{ color: "var(--color-text-muted)" }}>
                Q
              </th>
            </tr>
          </thead>
          <tbody>
            {gate.truthTable.map((row, i) => {
              const isActive =
                row.inputs.every((v, j) => v === inputs[j]);
              return (
                <tr
                  key={i}
                  style={{
                    background: isActive ? "var(--color-surface-hover)" : "transparent",
                  }}
                >
                  {row.inputs.map((v, j) => (
                    <td key={j} className="py-0.5">
                      {v ? "1" : "0"}
                    </td>
                  ))}
                  <td
                    className="py-0.5 font-bold"
                    style={{ color: row.output ? "var(--color-bit-on)" : "var(--color-text-muted)" }}
                  >
                    {row.output ? "1" : "0"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export function LogicGateExplorer(): React.ReactElement {
  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <h3 className="text-xl font-semibold">Logic Gate Explorer</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Click the input buttons to toggle them and see how each gate responds. Expand the truth
        table to see all input/output combinations.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GATE_DEFINITIONS.map((gate) => (
          <GateCard key={gate.name} gate={gate} />
        ))}
      </div>
    </div>
  );
}
