const express = require('express');
const app = express();

app.use(express.json());

let contacts = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
  {
    name: 'asa',
    number: '07098564321',
    id: 5,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const generateId = () => {
  let id = Math.floor(Math.random() * 100000000000) + 1;
  //create new array with all contacts id, then check if the one we just created
  // also exists
  return contacts.map((contact) => contact.id).includes(id)
    ? response.status(400).json({
        error: 'Error while creating. Please try again',
      })
    : id;
};

const nameAlreadyExist = (newName) => {
  const lowerCaseSpacelessName = newName.toLowerCase().replace(/ /g, '');

  return contacts.find(
    (contact) =>
      lowerCaseSpacelessName === contact.name.toLowerCase().replace(/ /g, '')
  );
};

app.post('/api/contacts', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing in request',
    });
  }

  if (nameAlreadyExist(body.name)) {
    return response.status(400).json({
      error: 'Sorry, name already exist',
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  contacts = contacts.concat(contact);
  response.json(contact);
});

app.get('/info', (req, res) => {
  const numberOfContacts = contacts.length;

  res.send(`<div>
              <p>Phonebook has info for ${numberOfContacts} people</p>
              <br/> 
              <p>${new Date()}</p>
           </div>`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
