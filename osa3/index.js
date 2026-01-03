require("dotenv").config();

console.log("dev works test");

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const Person = require("./models/person");

app.use(express.json());

morgan.token("body", (request) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Maria Niemi",
    number: "12345",
  },
];

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return String(id);
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const count = persons.length;
  const time = new Date();

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get(/^(?!\/api).*/, (request, response) => {
  response.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
