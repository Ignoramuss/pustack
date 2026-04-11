"use client";

import { useState, useCallback, useRef, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GateType = "INPUT" | "OUTPUT" | "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR";

type GateNode = {
  id: string;
  type: GateType;
  x: number;
  y: number;
  label?: string;
  value?: boolean; // Only used for INPUT type
};

type Wire = {
  id: string;
  fromGateId: string;
  fromPort: number;
  toGateId: string;
  toPort: number;
};

type CircuitState = {
  gates: GateNode[];
  wires: Wire[];
};

type Connecting = {
  fromGateId: string;
  fromPort: number;
  mouseX: number;
  mouseY: number;
};

type Dragging = {
  gateId: string;
  offsetX: number;
  offsetY: number;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GATE_W = 80;
const GATE_H = 50;
const PORT_R = 7;
const CANVAS_W = 760;
const CANVAS_H = 420;

const SIGNAL_ON = "var(--color-bit-on)";
const SIGNAL_OFF = "var(--color-bit-off)";
const SIGNAL_ON_WIRE = "#22c55e";
const SIGNAL_OFF_WIRE = "#4b5563";

// ---------------------------------------------------------------------------
// Gate logic
// ---------------------------------------------------------------------------

function inputCount(type: GateType): number {
  switch (type) {
    case "INPUT":
      return 0;
    case "NOT":
    case "OUTPUT":
      return 1;
    default:
      return 2;
  }
}

function outputCount(type: GateType): number {
  return type === "OUTPUT" ? 0 : 1;
}

function evaluateGate(type: GateType, inputs: boolean[]): boolean {
  switch (type) {
    case "AND":
      return inputs.length >= 2 && inputs[0] && inputs[1];
    case "OR":
      return inputs.length >= 2 && (inputs[0] || inputs[1]);
    case "NOT":
      return inputs.length >= 1 && !inputs[0];
    case "XOR":
      return inputs.length >= 2 && inputs[0] !== inputs[1];
    case "NAND":
      return inputs.length < 2 || !(inputs[0] && inputs[1]);
    case "NOR":
      return inputs.length >= 2 ? !(inputs[0] || inputs[1]) : true;
    case "OUTPUT":
      return inputs.length >= 1 ? inputs[0] : false;
    case "INPUT":
      return false; // handled separately
  }
}

// ---------------------------------------------------------------------------
// Signal evaluation via topological sort
// ---------------------------------------------------------------------------

function evaluateCircuit(
  gates: GateNode[],
  wires: Wire[]
): Map<string, boolean> {
  const signals = new Map<string, boolean>();

  // Initialize INPUT gates with their toggle value
  for (const gate of gates) {
    if (gate.type === "INPUT") {
      signals.set(gate.id, gate.value ?? false);
    }
  }

  // Build adjacency: gate -> list of gates it feeds into
  const dependents = new Map<string, Set<string>>();
  const incomingCount = new Map<string, number>();
  const wiresByTarget = new Map<string, Wire[]>();

  for (const gate of gates) {
    dependents.set(gate.id, new Set());
    const expectedInputs = inputCount(gate.type);
    incomingCount.set(gate.id, expectedInputs);
    wiresByTarget.set(gate.id, []);
  }

  for (const wire of wires) {
    dependents.get(wire.fromGateId)?.add(wire.toGateId);
    wiresByTarget.get(wire.toGateId)?.push(wire);
  }

  // Topological BFS (Kahn's algorithm)
  const queue: string[] = [];
  const resolved = new Map<string, number>(); // count of resolved inputs per gate

  for (const gate of gates) {
    resolved.set(gate.id, 0);
  }

  // INPUT gates have no dependencies, enqueue them
  for (const gate of gates) {
    if (gate.type === "INPUT") {
      queue.push(gate.id);
    }
  }

  const visited = new Set<string>();
  let iterations = 0;
  const maxIterations = gates.length * 2 + 10;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const gateId = queue.shift()!;
    if (visited.has(gateId)) continue;
    visited.add(gateId);

    const gate = gates.find((g) => g.id === gateId);
    if (!gate) continue;

    // Compute this gate's output
    if (gate.type !== "INPUT") {
      const inWires = wiresByTarget.get(gate.id) ?? [];
      const gateInputs: boolean[] = new Array(inputCount(gate.type)).fill(false) as boolean[];
      for (const w of inWires) {
        if (w.toPort < gateInputs.length) {
          gateInputs[w.toPort] = signals.get(w.fromGateId) ?? false;
        }
      }
      signals.set(gate.id, evaluateGate(gate.type, gateInputs));
    }

    // Enqueue dependents whose inputs are all resolved
    for (const depId of dependents.get(gateId) ?? []) {
      const count = (resolved.get(depId) ?? 0) + 1;
      resolved.set(depId, count);
      const depGate = gates.find((g) => g.id === depId);
      if (depGate && count >= inputCount(depGate.type)) {
        queue.push(depId);
      }
    }
  }

  // Evaluate any remaining unvisited gates (disconnected)
  for (const gate of gates) {
    if (!signals.has(gate.id)) {
      signals.set(gate.id, false);
    }
  }

  return signals;
}

// ---------------------------------------------------------------------------
// Wire signal lookup helper
// ---------------------------------------------------------------------------

function getWireSignal(wire: Wire, signals: Map<string, boolean>): boolean {
  return signals.get(wire.fromGateId) ?? false;
}

// ---------------------------------------------------------------------------
// Port position helpers
// ---------------------------------------------------------------------------

function getInputPortPos(
  gate: GateNode,
  portIndex: number
): { x: number; y: number } {
  const count = inputCount(gate.type);
  if (count === 0) return { x: gate.x, y: gate.y + GATE_H / 2 };
  const spacing = GATE_H / (count + 1);
  return {
    x: gate.x,
    y: gate.y + spacing * (portIndex + 1),
  };
}

function getOutputPortPos(gate: GateNode): { x: number; y: number } {
  return {
    x: gate.x + GATE_W,
    y: gate.y + GATE_H / 2,
  };
}

// ---------------------------------------------------------------------------
// ID generator
// ---------------------------------------------------------------------------

let idCounter = 0;
function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// ---------------------------------------------------------------------------
// Preset circuits
// ---------------------------------------------------------------------------

function makeHalfAdder(): CircuitState {
  return {
    gates: [
      { id: "ha-inA", type: "INPUT", x: 40, y: 60, label: "A", value: false },
      { id: "ha-inB", type: "INPUT", x: 40, y: 220, label: "B", value: false },
      { id: "ha-xor", type: "XOR", x: 300, y: 60 },
      { id: "ha-and", type: "AND", x: 300, y: 220 },
      { id: "ha-outS", type: "OUTPUT", x: 560, y: 60, label: "Sum" },
      { id: "ha-outC", type: "OUTPUT", x: 560, y: 220, label: "Carry" },
    ],
    wires: [
      { id: "ha-w1", fromGateId: "ha-inA", fromPort: 0, toGateId: "ha-xor", toPort: 0 },
      { id: "ha-w2", fromGateId: "ha-inB", fromPort: 0, toGateId: "ha-xor", toPort: 1 },
      { id: "ha-w3", fromGateId: "ha-inA", fromPort: 0, toGateId: "ha-and", toPort: 0 },
      { id: "ha-w4", fromGateId: "ha-inB", fromPort: 0, toGateId: "ha-and", toPort: 1 },
      { id: "ha-w5", fromGateId: "ha-xor", fromPort: 0, toGateId: "ha-outS", toPort: 0 },
      { id: "ha-w6", fromGateId: "ha-and", fromPort: 0, toGateId: "ha-outC", toPort: 0 },
    ],
  };
}

function makeFullAdder(): CircuitState {
  return {
    gates: [
      { id: "fa-inA", type: "INPUT", x: 30, y: 30, label: "A", value: false },
      { id: "fa-inB", type: "INPUT", x: 30, y: 140, label: "B", value: false },
      { id: "fa-inCin", type: "INPUT", x: 30, y: 280, label: "Cin", value: false },
      { id: "fa-xor1", type: "XOR", x: 220, y: 50 },
      { id: "fa-and1", type: "AND", x: 220, y: 170 },
      { id: "fa-xor2", type: "XOR", x: 420, y: 80 },
      { id: "fa-and2", type: "AND", x: 420, y: 220 },
      { id: "fa-or", type: "OR", x: 560, y: 260 },
      { id: "fa-outS", type: "OUTPUT", x: 640, y: 80, label: "Sum" },
      { id: "fa-outC", type: "OUTPUT", x: 680, y: 310, label: "Cout" },
    ],
    wires: [
      // A, B -> XOR1
      { id: "fa-w1", fromGateId: "fa-inA", fromPort: 0, toGateId: "fa-xor1", toPort: 0 },
      { id: "fa-w2", fromGateId: "fa-inB", fromPort: 0, toGateId: "fa-xor1", toPort: 1 },
      // A, B -> AND1
      { id: "fa-w3", fromGateId: "fa-inA", fromPort: 0, toGateId: "fa-and1", toPort: 0 },
      { id: "fa-w4", fromGateId: "fa-inB", fromPort: 0, toGateId: "fa-and1", toPort: 1 },
      // XOR1, Cin -> XOR2 (Sum)
      { id: "fa-w5", fromGateId: "fa-xor1", fromPort: 0, toGateId: "fa-xor2", toPort: 0 },
      { id: "fa-w6", fromGateId: "fa-inCin", fromPort: 0, toGateId: "fa-xor2", toPort: 1 },
      // XOR1, Cin -> AND2
      { id: "fa-w7", fromGateId: "fa-xor1", fromPort: 0, toGateId: "fa-and2", toPort: 0 },
      { id: "fa-w8", fromGateId: "fa-inCin", fromPort: 0, toGateId: "fa-and2", toPort: 1 },
      // AND1, AND2 -> OR (Carry)
      { id: "fa-w9", fromGateId: "fa-and1", fromPort: 0, toGateId: "fa-or", toPort: 0 },
      { id: "fa-w10", fromGateId: "fa-and2", fromPort: 0, toGateId: "fa-or", toPort: 1 },
      // Outputs
      { id: "fa-w11", fromGateId: "fa-xor2", fromPort: 0, toGateId: "fa-outS", toPort: 0 },
      { id: "fa-w12", fromGateId: "fa-or", fromPort: 0, toGateId: "fa-outC", toPort: 0 },
    ],
  };
}

// ---------------------------------------------------------------------------
// SVG sub-components
// ---------------------------------------------------------------------------

function GateBody({
  gate,
  signal,
  selected,
  onToggleInput,
  onMouseDown,
}: {
  gate: GateNode;
  signal: boolean;
  selected: boolean;
  onToggleInput: (id: string) => void;
  onMouseDown: (e: React.MouseEvent, gateId: string) => void;
}): React.ReactElement {
  const isInput = gate.type === "INPUT";
  const isOutput = gate.type === "OUTPUT";
  const borderColor = selected
    ? "var(--color-accent)"
    : signal
      ? SIGNAL_ON_WIRE
      : "var(--color-border)";

  return (
    <g
      onMouseDown={(e) => {
        if (isInput) {
          onToggleInput(gate.id);
        } else {
          onMouseDown(e, gate.id);
        }
      }}
      style={{ cursor: isInput ? "pointer" : "grab" }}
    >
      <rect
        x={gate.x}
        y={gate.y}
        width={GATE_W}
        height={GATE_H}
        rx={isInput || isOutput ? 25 : 6}
        fill={
          isInput
            ? signal
              ? "#166534"
              : "var(--color-surface)"
            : "var(--color-surface)"
        }
        stroke={borderColor}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      <text
        x={gate.x + GATE_W / 2}
        y={gate.y + GATE_H / 2 + (gate.label ? -3 : 5)}
        textAnchor="middle"
        fontSize={isInput || isOutput ? 12 : 13}
        fontWeight="bold"
        fill="var(--color-text)"
        fontFamily="monospace"
        pointerEvents="none"
      >
        {gate.type === "INPUT" || gate.type === "OUTPUT" ? (gate.label ?? gate.type) : gate.type}
      </text>
      {/* Show signal value for INPUT/OUTPUT */}
      {(isInput || isOutput) && (
        <text
          x={gate.x + GATE_W / 2}
          y={gate.y + GATE_H / 2 + 14}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill={signal ? SIGNAL_ON_WIRE : "var(--color-text-muted)"}
          fontFamily="monospace"
          pointerEvents="none"
        >
          {signal ? "1" : "0"}
        </text>
      )}
    </g>
  );
}

function PortCircle({
  x,
  y,
  signal,
  isOutput,
  onClick,
  highlight,
}: {
  x: number;
  y: number;
  signal: boolean;
  isOutput: boolean;
  onClick?: () => void;
  highlight?: boolean;
}): React.ReactElement {
  return (
    <circle
      cx={x}
      cy={y}
      r={PORT_R}
      fill={signal ? SIGNAL_ON_WIRE : SIGNAL_OFF_WIRE}
      stroke={highlight ? "var(--color-accent)" : "transparent"}
      strokeWidth={highlight ? 2 : 0}
      style={{ cursor: onClick ? "crosshair" : "default" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    />
  );
}

function WirePath({
  x1,
  y1,
  x2,
  y2,
  signal,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  signal: boolean;
}): React.ReactElement {
  const dx = Math.abs(x2 - x1) * 0.5;
  const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={signal ? SIGNAL_ON_WIRE : SIGNAL_OFF_WIRE}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  );
}

// ---------------------------------------------------------------------------
// Main CircuitBuilder component
// ---------------------------------------------------------------------------

export function CircuitBuilder(): React.ReactElement {
  const [circuit, setCircuit] = useState<CircuitState>({ gates: [], wires: [] });
  const [connecting, setConnecting] = useState<Connecting | null>(null);
  const [dragging, setDragging] = useState<Dragging | null>(null);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Evaluate signals
  const signals = useMemo(
    () => evaluateCircuit(circuit.gates, circuit.wires),
    [circuit]
  );

  // --- SVG coordinate helpers ---
  const svgPoint = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: clientX, y: clientY };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const transformed = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      return { x: transformed.x, y: transformed.y };
    },
    []
  );

  // --- Add gate ---
  const addGate = useCallback((type: GateType) => {
    const id = nextId(type.toLowerCase());
    const gate: GateNode = {
      id,
      type,
      x: 80 + Math.random() * 200,
      y: 80 + Math.random() * 200,
      label: type === "INPUT" ? `In` : type === "OUTPUT" ? `Out` : undefined,
      value: false,
    };
    setCircuit((prev) => ({
      ...prev,
      gates: [...prev.gates, gate],
    }));
  }, []);

  // --- Toggle INPUT gate ---
  const toggleInput = useCallback((gateId: string) => {
    setCircuit((prev) => ({
      ...prev,
      gates: prev.gates.map((g) =>
        g.id === gateId && g.type === "INPUT" ? { ...g, value: !g.value } : g
      ),
    }));
  }, []);

  // --- Delete selected gate ---
  const deleteSelected = useCallback(() => {
    if (!selectedGate) return;
    setCircuit((prev) => ({
      gates: prev.gates.filter((g) => g.id !== selectedGate),
      wires: prev.wires.filter(
        (w) => w.fromGateId !== selectedGate && w.toGateId !== selectedGate
      ),
    }));
    setSelectedGate(null);
  }, [selectedGate]);

  // --- Drag handling ---
  const handleGateMouseDown = useCallback(
    (e: React.MouseEvent, gateId: string) => {
      e.stopPropagation();
      const gate = circuit.gates.find((g) => g.id === gateId);
      if (!gate) return;
      const pt = svgPoint(e.clientX, e.clientY);
      setDragging({
        gateId,
        offsetX: pt.x - gate.x,
        offsetY: pt.y - gate.y,
      });
      setSelectedGate(gateId);
    },
    [circuit.gates, svgPoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) {
        const pt = svgPoint(e.clientX, e.clientY);
        const newX = Math.max(0, Math.min(CANVAS_W - GATE_W, pt.x - dragging.offsetX));
        const newY = Math.max(0, Math.min(CANVAS_H - GATE_H, pt.y - dragging.offsetY));
        setCircuit((prev) => ({
          ...prev,
          gates: prev.gates.map((g) =>
            g.id === dragging.gateId ? { ...g, x: newX, y: newY } : g
          ),
        }));
      }
      if (connecting) {
        const pt = svgPoint(e.clientX, e.clientY);
        setConnecting((prev) => (prev ? { ...prev, mouseX: pt.x, mouseY: pt.y } : null));
      }
    },
    [dragging, connecting, svgPoint]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  // --- Connection handling ---
  const startConnection = useCallback(
    (gateId: string, port: number) => {
      const gate = circuit.gates.find((g) => g.id === gateId);
      if (!gate) return;
      const pos = getOutputPortPos(gate);
      setConnecting({
        fromGateId: gateId,
        fromPort: port,
        mouseX: pos.x,
        mouseY: pos.y,
      });
    },
    [circuit.gates]
  );

  const completeConnection = useCallback(
    (toGateId: string, toPort: number) => {
      if (!connecting) return;
      if (connecting.fromGateId === toGateId) {
        setConnecting(null);
        return;
      }
      // Check if this input port is already connected
      const alreadyConnected = circuit.wires.some(
        (w) => w.toGateId === toGateId && w.toPort === toPort
      );
      if (alreadyConnected) {
        setConnecting(null);
        return;
      }
      const wire: Wire = {
        id: nextId("wire"),
        fromGateId: connecting.fromGateId,
        fromPort: connecting.fromPort,
        toGateId,
        toPort,
      };
      setCircuit((prev) => ({
        ...prev,
        wires: [...prev.wires, wire],
      }));
      setConnecting(null);
    },
    [connecting, circuit.wires]
  );

  // --- Clear canvas ---
  const clearCircuit = useCallback(() => {
    setCircuit({ gates: [], wires: [] });
    setConnecting(null);
    setSelectedGate(null);
  }, []);

  // --- Load preset ---
  const loadPreset = useCallback((preset: "half-adder" | "full-adder") => {
    idCounter = 0;
    setConnecting(null);
    setSelectedGate(null);
    setCircuit(preset === "half-adder" ? makeHalfAdder() : makeFullAdder());
  }, []);

  // --- Cancel connection on Escape ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setConnecting(null);
        setSelectedGate(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedGate) {
        deleteSelected();
      }
    },
    [selectedGate, deleteSelected]
  );

  // --- Palette ---
  const gateTypes: GateType[] = ["INPUT", "AND", "OR", "NOT", "XOR", "NAND", "NOR", "OUTPUT"];

  return (
    <div
      className="rounded-xl p-6 space-y-4"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h3 className="text-xl font-semibold">Circuit Builder</h3>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Add gates from the palette, drag to position, click output ports (right) then input ports
        (left) to connect. Click INPUT gates to toggle their value. Select a gate and press Delete
        to remove it.
      </p>

      {/* Palette */}
      <div className="flex flex-wrap gap-2">
        {gateTypes.map((type) => (
          <button
            key={type}
            onClick={() => addGate(type)}
            className="rounded-md px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
            style={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            + {type}
          </button>
        ))}
        <span className="w-px mx-1" style={{ background: "var(--color-border)" }} />
        <button
          onClick={() => loadPreset("half-adder")}
          className="rounded-md px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
          }}
        >
          Half Adder
        </button>
        <button
          onClick={() => loadPreset("full-adder")}
          className="rounded-md px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
          }}
        >
          Full Adder
        </button>
        <span className="w-px mx-1" style={{ background: "var(--color-border)" }} />
        {selectedGate && (
          <button
            onClick={deleteSelected}
            className="rounded-md px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
            style={{
              background: "#7f1d1d",
              border: "1px solid #ef4444",
              color: "#ef4444",
            }}
          >
            Delete
          </button>
        )}
        <button
          onClick={clearCircuit}
          className="rounded-md px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="rounded-lg"
        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSelectedGate(null);
          setConnecting(null);
        }}
      >
        {/* Grid dots */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="#333" />
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />

        {/* Wires */}
        {circuit.wires.map((wire) => {
          const fromGate = circuit.gates.find((g) => g.id === wire.fromGateId);
          const toGate = circuit.gates.find((g) => g.id === wire.toGateId);
          if (!fromGate || !toGate) return null;
          const from = getOutputPortPos(fromGate);
          const to = getInputPortPos(toGate, wire.toPort);
          const sig = getWireSignal(wire, signals);
          return (
            <WirePath
              key={wire.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              signal={sig}
            />
          );
        })}

        {/* Connecting preview wire */}
        {connecting && (() => {
          const fromGate = circuit.gates.find((g) => g.id === connecting.fromGateId);
          if (!fromGate) return null;
          const from = getOutputPortPos(fromGate);
          return (
            <WirePath
              x1={from.x}
              y1={from.y}
              x2={connecting.mouseX}
              y2={connecting.mouseY}
              signal={false}
            />
          );
        })()}

        {/* Gates */}
        {circuit.gates.map((gate) => {
          const sig = signals.get(gate.id) ?? false;
          return (
            <g key={gate.id}>
              <GateBody
                gate={gate}
                signal={sig}
                selected={selectedGate === gate.id}
                onToggleInput={toggleInput}
                onMouseDown={handleGateMouseDown}
              />

              {/* Input ports */}
              {Array.from({ length: inputCount(gate.type) }).map((_, i) => {
                const pos = getInputPortPos(gate, i);
                const isConnected = circuit.wires.some(
                  (w) => w.toGateId === gate.id && w.toPort === i
                );
                const portSignal = circuit.wires
                  .filter((w) => w.toGateId === gate.id && w.toPort === i)
                  .some((w) => signals.get(w.fromGateId) ?? false);
                return (
                  <PortCircle
                    key={`in-${i}`}
                    x={pos.x}
                    y={pos.y}
                    signal={portSignal}
                    isOutput={false}
                    highlight={connecting !== null && !isConnected}
                    onClick={
                      connecting && !isConnected
                        ? () => completeConnection(gate.id, i)
                        : undefined
                    }
                  />
                );
              })}

              {/* Output port */}
              {outputCount(gate.type) > 0 && (() => {
                const pos = getOutputPortPos(gate);
                return (
                  <PortCircle
                    x={pos.x}
                    y={pos.y}
                    signal={sig}
                    isOutput={true}
                    highlight={connecting === null}
                    onClick={() => startConnection(gate.id, 0)}
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Empty state */}
        {circuit.gates.length === 0 && (
          <text
            x={CANVAS_W / 2}
            y={CANVAS_H / 2}
            textAnchor="middle"
            fontSize={14}
            fill="var(--color-text-muted)"
            fontFamily="monospace"
          >
            Add gates from the palette above, or load a preset circuit
          </text>
        )}
      </svg>

      {/* Status bar */}
      {connecting && (
        <p className="text-xs font-mono" style={{ color: "var(--color-accent)" }}>
          Click an input port to complete the connection, or press Esc to cancel.
        </p>
      )}
    </div>
  );
}
