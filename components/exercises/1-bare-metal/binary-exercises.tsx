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
    id: "dec-to-bin",
    prompt: "Convert the decimal number 42 to binary (8-bit):",
    expectedAnswer: "00101010",
    hint: "42 = 32 + 8 + 2 = 2⁵ + 2³ + 2¹",
    validate: (input) => input.replace(/\s/g, "") === "00101010",
  },
  {
    id: "bin-to-hex",
    prompt: "Convert 11011110 (binary) to hexadecimal:",
    expectedAnswer: "DE",
    hint: "Split into nibbles: 1101 1110. Each nibble maps to one hex digit.",
    validate: (input) => input.trim().toUpperCase() === "DE",
  },
  {
    id: "hex-to-dec",
    prompt: "Convert 0xFF to decimal:",
    expectedAnswer: "255",
    hint: "F = 15. So 0xFF = 15×16 + 15.",
    validate: (input) => input.trim() === "255",
  },
  {
    id: "twos-complement",
    prompt: "What is −5 in 8-bit two's complement binary?",
    expectedAnswer: "11111011",
    hint: "5 = 00000101. Invert: 11111010. Add 1: 11111011.",
    validate: (input) => input.replace(/\s/g, "") === "11111011",
  },
  {
    id: "utf8-bytes",
    prompt: 'How many bytes does the UTF-8 encoding of "€" (U+20AC) require?',
    expectedAnswer: "3",
    hint: "U+20AC is in the range U+0800–U+FFFF, which requires 3 bytes in UTF-8.",
    validate: (input) => input.trim() === "3",
  },
];

type ExerciseState = {
  answer: string;
  status: "idle" | "correct" | "wrong";
  showHint: boolean;
};

export function BinaryExercises(): React.ReactElement {
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
                {state.status === "correct" ? "✓" : "Check"}
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
                💡 {ex.hint}
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
            All exercises completed! Great job understanding binary, hex, and data representation.
          </p>
        </div>
      )}
    </div>
  );
}
