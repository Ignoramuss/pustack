import { BinaryConverter } from "@/components/visualizations/1-bare-metal/binary-converter";
import { TwosComplement } from "@/components/visualizations/1-bare-metal/twos-complement";
import { Ieee754Viewer } from "@/components/visualizations/1-bare-metal/ieee754-viewer";
import { CharacterEncoding } from "@/components/visualizations/1-bare-metal/character-encoding";
import { BinaryExercises } from "@/components/exercises/1-bare-metal/binary-exercises";
import Content from "@/content/topics/1-bare-metal/1-binary-bits-data-representation.mdx";

const components = {
  BinaryConverter,
  TwosComplement,
  Ieee754Viewer,
  CharacterEncoding,
  BinaryExercises,
};

export const metadata = {
  title: "1.01 Binary, Bits, and Data Representation | pustack",
  description:
    "Interactive exploration of binary, hexadecimal, two's complement, IEEE 754, and character encoding.",
};

export default function BinaryBitsPage(): React.ReactElement {
  return (
    <article className="space-y-8">
      <nav className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        <a href="/" className="hover:underline">
          Home
        </a>{" "}
        / Track 1: Bare Metal / 1.01
      </nav>
      <div className="prose prose-invert max-w-none">
        <Content components={components} />
      </div>
    </article>
  );
}
