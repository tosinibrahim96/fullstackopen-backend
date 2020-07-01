const mongoose = require("mongoose");

console.log('here',process.env.DB_PASSWORD)

const connectToMongoDB = (password, database) => {
  const url = `mongodb+srv://fullstackopen-contacts:${password}@cluster0-m8swz.mongodb.net/${database}?retryWrites=true&w=majority`;
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
};

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Contact = mongoose.model("Contact", contactSchema);

const saveNewContact = () => {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log("concact saved!");
    console.log(result);
    mongoose.connection.close();
  });
};

const getAllContacts = () => {
  Contact.find({}).then((result) => {
    console.log("All contacts retrieved");
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// if (process.argv.length === 3);
// {
//   connectToMongoDB(process.argv[2], "contacts");
//   getAllContacts();
// }

// if (process.argv.length === 5) {
//   connectToMongoDB(process.argv[2], "contacts");
//   saveNewContact();
// }

// const url = `mongodb+srv://fullstackopen-contacts:xpo6AtHd3kAcO8l5@cluster0-m8swz.mongodb.net/contacts?retryWrites=true&w=majority`;

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// const contactSchema = new mongoose.Schema({
//   name: String,
//   number: Number,
// });

// const Contact = mongoose.model("Contact", contactSchema);

// const contact = new Contact({
//   content: "HTML is Easy",
//   date: new Date(),
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });
// Contact.find({}).then(result => {
//   result.forEach(contact => {
//     console.log(contact)
//   })
//   mongoose.connection.close()
// })
