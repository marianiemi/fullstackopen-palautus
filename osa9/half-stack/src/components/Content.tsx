import type { CoursePart } from "../types";
import Part from "./Part";

type ContentProps = {
  parts: CoursePart[];
};

const Content = ({ parts }: ContentProps) => (
  <div>
    {parts.map((part) => (
      <Part key={part.name} part={part} />
    ))}
  </div>
);

export default Content;
