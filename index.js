require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/Contact");

morgan.token("newContact", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :newContact"));
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.post("/api/contacts", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  }

  Contact.findOne({ name: body.name })
    .then((contact) => {
      if (contact) {
        request.url = `/api/contacts/${contact.id}`;
        request.method = "PUT";

        app.handle(request, response, next);
      } else {
        const contact = new Contact({
          name: body.name,
          number: body.number,
        });

        contact
          .save()
          .then((newContact) => {
            response.json(newContact);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

app.get("/api/contacts", (req, res) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((error) => next(error));
});

app.get("/api/contacts/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).json({ error: "contact not found" });
      }
    })
    .catch((error) => next(error));
});

app.put("/api/contacts/:id", (request, response) => {
  const body = request.body;

  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "content missing" });
  }

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then((updatedContact) => {
      if (updatedContact) {
        response.status(200).json(updatedContact);
      } else {
        response.status(404).json({ error: "contact not found" });
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/contacts/:id", (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((contact) => {
      if (contact) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "contact not found" });
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const numberOfContacts = contacts.length;

  res.send(`<div>
              <p>Phonebook has info for ${numberOfContacts} people</p>
              <br/>
              <p>${new Date()}</p>
           </div>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
