const express = require("express");
const cors = require("cors");

// déclaration des routes
const facturesRoutes = require("./routes/factures");
const clientsRoutes = require("./routes/clients");

const app = express();
app.use(express.json());
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/factures", facturesRoutes);
app.use("/clients", clientsRoutes);

app.get("/", (req, res) => {
  res.send({
    api: "API REST pour la gestion de factures",
    version: "0.1.0",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
