const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

module.exports = {
  // Récupérer toutes les clients
  getAll: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      res.send(data);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Récupérer une client
  getOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );
      const clients = JSON.parse(data);
      const id = req.params.id;
      const client = clients.find((client) => client.id == id);
      if (client) {
        res.json(client);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Ajouter une client
  postOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );

      const clients = JSON.parse(data);
      const newClient = { ...req.body, id: uuid() };

      clients.push(newClient);
      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );

      res.json(newClient);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Mettre à jour un client
  patchOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );

      let clients = JSON.parse(data);
      const id = req.params.id;

      let updateClient = clients.find((client) => client.id == id);
      let updateClientIndex = clients.findIndex((client) => client.id == id);

      if (updateClient) {
        updateClient = { ...updateClient, ...req.body };
        clients[updateClientIndex] = { ...updateClient };
      } else {
        res.sendStatus(404);
        return;
      }

      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );
      res.json(updateClient);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Supprimer une client
  deleteOne: (req, res) => {
    try {
      const data = fs.readFileSync(
        path.resolve(__dirname, "../db/clients.json")
      );

      let clients = JSON.parse(data);
      const id = req.params.id;

      clients = clients.filter((client) => client.id != id);

      fs.writeFileSync(
        path.resolve(__dirname, "../db/clients.json"),
        JSON.stringify(clients)
      );

      res.json(clients);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
};
