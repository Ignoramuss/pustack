import Link from "next/link";

export default function Home(): React.ReactElement {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">pustack</h1>
      <p className="text-[var(--color-text-muted)] text-lg">
        Interactive learning platform for computer science and distributed systems.
      </p>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Track 1: Bare Metal</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tracks/1-bare-metal/1-binary-bits-data-representation"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline"
            >
              1.01 Binary, Bits, and Data Representation
            </Link>
          </li>
          <li>
            <Link
              href="/tracks/1-bare-metal/2-logic-gates-and-boolean-algebra"
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline"
            >
              1.02 Logic Gates and Boolean Algebra
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
