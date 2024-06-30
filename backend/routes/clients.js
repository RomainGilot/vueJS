const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clients.js");

// récupérer toutes les clients
router.get("/", ctrl.getAll);

// récupérer une seule client
router.get("/:id", ctrl.getOne);

// ajouter une client
router.post("/", ctrl.postOne);

// modifier une client
router.patch("/:id", ctrl.patchOne);

// supprimer une client
router.delete("/:id", ctrl.deleteOne);

module.exports = router;
