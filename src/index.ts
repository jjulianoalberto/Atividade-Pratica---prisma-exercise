import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Rotas para Crimes
app.get("/crime", async (req, res) => {
  const crimes = await prisma.crime.findMany({
    include: { criminoso: true, armas: true },
  });
  res.json(crimes);
});

app.post("/crime", async (req, res) => {
  const { descricao, data, localizacao, criminosoId, armas } = req.body;
  const crime = await prisma.crime.create({
    data: {
      descricao,
      data: new Date(data),
      localizacao,
      criminosoId,
      armas: {
        create: armas, // Array de armas
      },
    },
  });
  res.json(crime);
});

// Rotas para Criminosos
app.get("/criminoso", async (req, res) => {
  const criminosos = await prisma.criminoso.findMany({
    include: { crimes: true },
  });
  res.json(criminosos);
});

app.post("/criminoso", async (req, res) => {
  const { nome, dataNascimento } = req.body;
  const criminoso = await prisma.criminoso.create({
    data: { nome, dataNascimento: new Date(dataNascimento) },
  });
  res.json(criminoso);
});

// Rotas para Armas
app.get("/arma", async (req, res) => {
  const armas = await prisma.arma.findMany({
    include: { crime: true },
  });
  res.json(armas);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
