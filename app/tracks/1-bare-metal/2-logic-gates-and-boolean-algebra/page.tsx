import { LogicGateExplorer } from "@/components/visualizations/1-bare-metal/logic-gate-explorer";
import { CircuitBuilder } from "@/components/visualizations/1-bare-metal/circuit-builder";
import { LogicGatesExercises } from "@/components/exercises/1-bare-metal/logic-gates-exercises";
import Content from "@/content/topics/1-bare-metal/2-logic-gates-and-boolean-algebra.mdx";

const components = {
  LogicGateExplorer,
  CircuitBuilder,
  LogicGatesExercises,
};

export const metadata = {
  title: "1.02 Logic Gates and Boolean Algebra | pustack",
  description:
    "Interactive exploration of logic gates, Boolean algebra, and building adder circuits from gates.",
};

export default function LogicGatesPage(): React.ReactElement {
  return (
    <article className="space-y-8">
      <nav className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        <a href="/" className="hover:underline">
          Home
        </a>{" "}
        / Track 1: Bare Metal / 1.02
      </nav>
      <div className="prose prose-invert max-w-none">
        <Content components={components} />
      </div>
    </article>
  );
}
