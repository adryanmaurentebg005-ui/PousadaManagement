import express from 'express';
import Quarto from '../models/Quarto.js';


const router = express.Router();

// Listar quartos
router.get('/', async (req, res, next) => {
  try {
    const { tipo } = req.query;
    const filter = {};
    if (tipo && tipo !== 'Todos') filter.tipo = tipo;

    const quartos = await Quarto.find(filter).lean();
    res.render('quartos/lista', { 
      title: 'Quartos', 
      page: 'quartos', 
      quartos, 
      filtroAtual: tipo || 'Todos' 
    });
  } catch (err) {
    next(err);
  }
});

// Ver detalhes do quarto
router.get('/:id', async (req, res, next) => {
  try {
    const quarto = await Quarto.findById(req.params.id).lean();
    if (!quarto) return res.redirect('/quartos');
    res.render('quartos/detalhes', { 
      title: `Quarto ${quarto.numero}`, 
      page: 'quartos', 
      quarto 
    });
  } catch (err) {
    next(err);
  }
});

export default router;
