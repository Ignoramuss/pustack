"use client";

import { useState, useCallback } from "react";

type Exercise = {
  id: string;
  prompt: string;
  expectedAnswer: string;
  hint: string;
  validate: (input: string) => boolean;
};

const exercises: Exercise[] = [
  {
    id: "and-output",
    prompt: "What is the output of AND(1, 0)?",
    expectedAnswer: "0",
    hint: "AND outputs 1 only when ALL inputs are 1.",
    validate: (input) => input.trim() === "0",
  },
  {
    id: "xor-truth",
    prompt: "XOR(1, 1) = ?",
    expectedAnswer: "0",
    hint: "XOR outputs 1 when the inputs are DIFFERENT.",
    validate: (input) => input.trim() === "0",
  },
  {
    id: "nand-complete",
    prompt: "NAND(0, 0) = ?",
    expectedAnswer: "1",
    hint: "NAND is the inverse of AND. AND(0,0) = 0, so NAND(0,0) = 1.",
    validate: (input) => input.trim() === "1",
  },
  {
    id: "half-adder-sum",
    prompt: "A half-adder computes Sum = A XOR B. What is Sum when A=1, B=1?",
    expectedAnswer: "0",
    hint: "XOR(1, 1) = 0 because both inputs are the same.",
    validate: (input) => input.trim() === "0",
  },
  {
    id: "half-adder-carry",
    prompt: "A half-adder computes Carry = A AND B. What is Carry when A=1, B=1?",
    expectedAnswer: "1",
    hint: "AND(1, 1) = 1 because both inputs are 1.",
    validate: (input) => input.trim() === "1",
  },
  {
    id: "full-adder-sum",
    prompt: "A full-adder: Sum = A XOR B XOR Cin. What is Sum when A=1, B=1, Cin=1?",
    expectedAnswer: "1",
    hint: "XOR(1, 1) = 0, then XOR(0, 1) = 1.",
    validate: (input) => input.trim() === "1",
  },
  {
    id: "full-adder-carry",
    prompt:
      "A full-adder: Cout = (A AND B) OR ((A XOR B) AND Cin). What is Cout when A=1, B=0, Cin=1?",
    expectedAnswer: "1",
    hint: "A AND B = 0. A XOR B = 1. 1 AND Cin = 1. 0 OR 1 = 1.",
    validate: (input) => input.trim() === "1",
  },
  {
    id: "demorgan",
    prompt: "By De Morgan's law, NOT(A AND B) is equivalent to: (answer as gate expression, e.g. \"NOT A OR NOT B\")",
    expectedAnswer: "NOT A OR NOT B",
    hint: "De Morgan's: NOT(A AND B) = NOT A OR NOT B. Break the AND, flip to OR, negate each input.",
    validate: (input) => {
      const normalized = input.trim().toUpperCase().replace(/\s+/g, " ");
      return (
        normalized === "NOT A OR NOT B" ||
        normalized === "(NOT A) OR (NOT B)" ||
        normalized === "!A OR !B" ||
        normalized === "~A OR ~B" ||
        normalized === "A' OR B'" ||
        normalized === "NOT(A) OR NOT(B)"
      );
    },
  },
];

type ExerciseState = {
  answer: string;
  status: "idle" | "correct" | "wrong";
  showHint: boolean;
};

export function LogicGatesExercises(): React.ReactElement {
  const [states, setStates] = useState<Record<string, ExerciseState>>(() => {
    const initial: Record<string, ExerciseState> = {};
    for (const ex of exercises) {
      initial[ex.id] = { answer: "", status: "idle", showHint: false };
    }
    return initial;
  });

  const handleChange = useCallback((id: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], answer: value, status: "idle" },
    }));
  }, []);

  const handleSubmit = useCallback((id: string) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) return;
    setStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: exercise.validate(prev[id].answer) ? "correct" : "wrong",
      },
    }));
  }, []);

  const toggleHint = useCallback((id: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], showHint: !prev[id].showHint },
    }));
  }, []);

  const completed = Object.values(states).filter((s) => s.status === "correct").length;

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Exercises</h3>
        <span className="text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
          {completed}/{exercises.length} completed
        </span>
      </div>

      {exercises.map((ex) => {
        const state = states[ex.id];
        return (
          <div
            key={ex.id}
            className="rounded-lg p-4 space-y-3"
            style={{
              background: "var(--color-bg)",
              border: `1px solid ${
                state.status === "correct"
                  ? "var(--color-bit-on)"
                  : state.status === "wrong"
                    ? "#ef4444"
                    : "var(--color-border)"
              }`,
            }}
          >
            <p className="text-sm font-medium">{ex.prompt}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={state.answer}
                onChange={(e) => handleChange(ex.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(ex.id);
                }}
                placeholder="Your answer..."
                className="flex-1 rounded-md px-3 py-2 font-mono text-sm"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                disabled={state.status === "correct"}
              />
              <button
                onClick={() => handleSubmit(ex.id)}
                disabled={state.status === "correct"}
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  background:
                    state.status === "correct" ? "var(--color-bit-on)" : "var(--color-accent)",
                  color: "#fff",
                  opacity: state.status === "correct" ? 0.7 : 1,
                }}
              >
                {state.status === "correct" ? "\u2713" : "Check"}
              </button>
            </div>

            {state.status === "wrong" && (
              <p className="text-sm" style={{ color: "#ef4444" }}>
                Not quite. Try again!
              </p>
            )}

            {state.status !== "correct" && (
              <button
                onClick={() => toggleHint(ex.id)}
                className="text-xs underline cursor-pointer"
                style={{ color: "var(--color-text-muted)" }}
              >
                {state.showHint ? "Hide hint" : "Show hint"}
              </button>
            )}

            {state.showHint && state.status !== "correct" && (
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {ex.hint}
              </p>
            )}
          </div>
        );
      })}

      {completed === exercises.length && (
        <div
          className="rounded-lg p-4 text-center"
          style={{ background: "#14532d", border: "1px solid var(--color-bit-on)" }}
        >
          <p className="font-semibold" style={{ color: "var(--color-bit-on)" }}>
            All exercises completed! You now understand logic gates, Boolean algebra, and how
            half-adders and full-adders work.
          </p>
        </div>
      )}
    </div>
  );
}
