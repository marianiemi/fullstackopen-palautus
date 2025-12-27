import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const showNotification = (message, type = "success", seconds = 4) => {
    console.log(`[NOTIFICATION:${type}]`, message);
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, seconds * 1000);
  };

  // =========================
  // INITIAL DATA FETCH
  // =========================
  useEffect(() => {
    console.log("Fetching persons from server...");
    personService
      .getAll()
      .then((initialPersons) => {
        console.log("Persons fetched:", initialPersons);
        setPersons(initialPersons);
      })
      .catch((error) => {
        console.error("Failed to fetch persons:", error);
        showNotification("Failed to fetch persons from server", "error", 5);
      });
  }, []);

  // =========================
  // HANDLERS
  // =========================
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  // =========================
  // ADD / UPDATE PERSON
  // =========================
  const addPerson = (event) => {
    event.preventDefault();

    console.log("Add person triggered:", newName, newNumber);

    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();

    if (!trimmedName || !trimmedNumber) {
      console.warn("Validation failed: name or number missing");
      showNotification("Name and number are required", "error", 4);
      return;
    }

    const existing = persons.find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
    };

    // UPDATE EXISTING
    if (existing) {
      console.log("Person already exists, attempting update:", existing);

      const ok = window.confirm(
        `${existing.name} is already added to phonebook, replace the old number with a new one?`
      );
      if (!ok) {
        console.log("User cancelled update");
        return;
      }

      const changedPerson = { ...existing, number: trimmedNumber };

      personService
        .update(existing.id, changedPerson)
        .then((returnedPerson) => {
          console.log("Update successful:", returnedPerson);
          setPersons(
            persons.map((p) => (p.id !== existing.id ? p : returnedPerson))
          );
          setNewName("");
          setNewNumber("");
          showNotification(`Updated ${returnedPerson.name}`, "success");
        })
        .catch((error) => {
          console.error("Update failed:", error);
          showNotification(
            `Information of ${existing.name} has already been removed from server`,
            "error",
            5
          );
          setPersons(persons.filter((p) => p.id !== existing.id));
        });

      return;
    }

    // CREATE NEW
    console.log("Creating new person:", personObject);

    personService
      .create(personObject)
      .then((returnedPerson) => {
        console.log("Create successful:", returnedPerson);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        showNotification(`Added ${returnedPerson.name}`, "success");
      })
      .catch((error) => {
        console.error("Create failed:", error);
        showNotification("Failed to add person", "error", 5);
      });
  };

  // =========================
  // DELETE PERSON
  // =========================
  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (!person) {
      console.warn("Delete attempted for non-existing person:", id);
      return;
    }

    console.log("Delete requested for:", person);

    const ok = window.confirm(`Delete ${person.name}?`);
    if (!ok) {
      console.log("User cancelled delete");
      return;
    }

    personService
      .remove(id)
      .then(() => {
        console.log("Delete successful:", person.name);
        setPersons(persons.filter((p) => p.id !== id));
        showNotification(`Deleted ${person.name}`, "success");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        showNotification(
          `Information of ${person.name} has already been removed from server`,
          "error",
          5
        );
        setPersons(persons.filter((p) => p.id !== id));
      });
  };

  // =========================
  // FILTERED VIEW
  // =========================
  const personsToShow =
    filter.trim() === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.trim().toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />

      <Footer />
    </div>
  );
};

export default App;
