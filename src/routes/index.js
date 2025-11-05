import express from 'express';

const router = express.Router();

// Página inicial
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Pousada Paraíso - Início',
    page: 'home'
  });
});

export default router;
