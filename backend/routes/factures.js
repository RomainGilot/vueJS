const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/factures.js");

// récupérer toutes les factures
router.get("/", ctrl.getAll);

// récupérer une seule facture
router.get("/:id", ctrl.getOne);

// ajouter une facture
router.post("/", ctrl.postOne);

// modifier une facture
router.patch("/:id", ctrl.patchOne);

// supprimer une facture
router.delete("/:id", ctrl.deleteOne);

module.exports = router;
