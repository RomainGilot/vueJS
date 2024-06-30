const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

module.exports = {
  // Récupérer toutes les factures
  getAll: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, "../db/factures.json"));
      res.send(data);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Récupérer une facture
  getOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, "../db/factures.json"));
      const factures = JSON.parse(data);
      const id = req.params.id;
      const facture = factures.find((facture) => facture.id == id);
      if (facture) {
        res.json(facture);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Ajouter une facture
  postOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, "../db/factures.json"));

      const factures = JSON.parse(data);
      const newFacture = { ...req.body, id: uuid() };

      factures.push(newFacture);
      fs.writeFileSync(path.resolve(__dirname, "../db/factures.json"), JSON.stringify(factures));

      res.json(newFacture);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Mettre à jour une facture
  patchOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, "../db/factures.json"));

      let factures = JSON.parse(data);
      const id = req.params.id;

      let updateFacture = factures.find((facture) => facture.id == id);
      let updateFactureIndex = factures.findIndex((facture) => facture.id == id);

      if (updateFacture) {
        updateFacture = { ...updateFacture, ...req.body };
        factures[updateFactureIndex] = { ...updateFacture };
      } else {
        res.sendStatus(404);
        return;
      }

      fs.writeFileSync(path.resolve(__dirname, "../db/factures.json"), JSON.stringify(factures));
      res.json(updateFacture);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  // Supprimer une facture
  deleteOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, "../db/factures.json"));

      let factures = JSON.parse(data);
      const id = req.params.id;

      factures = factures.filter((facture) => facture.id != id);

      fs.writeFileSync(path.resolve(__dirname, "../db/factures.json"), JSON.stringify(factures));

      res.json(factures);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },
};
