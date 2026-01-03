const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://marnie_db_user:${password}@cluster0.yakthcp.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");

  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });

  return;
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });

  return;
}

console.log("invalid arguments");
console.log("usage:");
console.log("  node mongo.js yourpassword");
console.log('  node mongo.js yourpassword "Arto Vihavainen" 040-1234556');
mongoose.connection.close();
