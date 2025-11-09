import express from 'express';
import Quarto from '../models/Quarto.js';


const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { tipo, search } = req.query;

    const filter = {};

    if (tipo && tipo !== 'Todos') {
      filter.tipo = tipo;
    }

   if (search && search.trim() !== '') {
    
  const isNumber = !isNaN(search); 

  filter.$or = [
    { numero: { $regex: search, $options: 'i' } },
    { tipo: { $regex: search, $options: 'i' } },
    { descricao: { $regex: search, $options: 'i' } },
    { status: { $regex: search, $options: 'i' } },
    { comodidades: { $regex: search, $options: 'i' } },
  ];

  if (isNumber) {
    filter.$or.push(
      { capacidade: Number(search) },
      { precoDiaria: Number(search) }
    );
  }
}

    const quartos = await Quarto.find(filter).lean();

    res.render('quartos/lista', { 
      title: 'Quartos', 
      page: 'quartos', 
      quartos,
      filtroAtual: tipo || 'Todos',
      search: search || '' 
    });
  } catch (err) {
    next(err);
  }
});

await Quarto.insertMany([
  // SIMPLES
  {
    numero: "101",
    tipo: "Simples",
    capacidade: 1,
    precoDiaria: 90,
    descricao: "Quarto simples e aconchegante.",
    comodidades: ["Wi-Fi", "TV"],
    imagem: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    status: "Disponível"
  },
  {
    numero: "102",
    tipo: "Simples",
    capacidade: 1,
    precoDiaria: 95,
    descricao: "Ideal para estadias rápidas.",
    comodidades: ["Wi-Fi"],
    imagem: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    status: "Disponível"
  },

  // DUPLO
  {
    numero: "201",
    tipo: "Duplo",
    capacidade: 2,
    precoDiaria: 140,
    descricao: "Quarto confortável para duas pessoas.",
    comodidades: ["Wi-Fi", "TV Smart", "Ar Condicionado"],
    imagem: "https://images.unsplash.com/photo-1601918774946-25832a4be0d1?w=800",
    status: "Disponível"
  },
  {
    numero: "202",
    tipo: "Duplo",
    capacidade: 2,
    precoDiaria: 150,
    descricao: "Perfeito para casais.",
    comodidades: ["Wi-Fi", "Frigobar", "Varanda"],
    imagem: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    status: "Disponível"
  },

  // LUXO
  {
    numero: "301",
    tipo: "Luxo",
    capacidade: 3,
    precoDiaria: 240,
    descricao: "Espaçoso e confortável com vista.",
    comodidades: ["Wi-Fi", "Ar Condicionado", "TV Smart", "Frigobar", "Varanda"],
    imagem: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    status: "Disponível"
  },
  {
    numero: "302",
    tipo: "Luxo",
    capacidade: 2,
    precoDiaria: 260,
    descricao: "Ambiente moderno e bem iluminado.",
    comodidades: ["Wi-Fi", "Ar Condicionado", "TV Smart", "Room Service"],
    imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    status: "Disponível"
  },

  // SUÍTE
  {
    numero: "401",
    tipo: "Suíte",
    capacidade: 4,
    precoDiaria: 350,
    descricao: "Suíte completa com ampla varanda.",
    comodidades: ["Wi-Fi", "Ar Condicionado", "TV Smart", "Frigobar", "Jacuzzi", "Room Service"],
    imagem: "https://images.unsplash.com/photo-1590490359683-108b0f5fd6af?w=800",
    status: "Disponível"
  },
  {
    numero: "402",
    tipo: "Suíte",
    capacidade: 3,
    precoDiaria: 330,
    descricao: "Suíte aconchegante com área de descanso.",
    comodidades: ["Wi-Fi", "Ar Condicionado", "Varanda", "TV Smart"],
    imagem: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    status: "Disponível"
  }
]);



export default router;
