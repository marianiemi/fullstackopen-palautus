const Header = (props) => <h2>{props.course}</h2>;

const Content = (props) => (
  <div>
    {props.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => (
  <p>
    <strong>total of {props.total} exercises</strong>
  </p>
);

const Course = (props) => {
  console.log("Course received:", props.course.name);

  const totalExercises = props.course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );

  console.log("Total exercises:", totalExercises);

  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default Course;
