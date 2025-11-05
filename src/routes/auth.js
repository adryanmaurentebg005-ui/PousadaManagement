import express from 'express';
import mongoose from 'mongoose';
import { Hospede } from '../models/index.js';

const router = express.Router();

// Página de login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', {
    title: 'Login',
    page: 'login',
    error: null
  });
});

// Processar login
router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // If mongoose is connected, use MongoDB; otherwise fall back to in-memory DB
    if (mongoose.connection.readyState === 1) {
      const user = await Hospede.findOne({ email, senha }).lean();
      if (user) {
        req.session.user = { id: String(user._id), nome: user.nome, email: user.email, tipo: user.tipo };
        return res.redirect('/');
      }
    } 

    return res.render('auth/login', {
      title: 'Login',
      page: 'login',
      error: 'Email ou senha incorretos'
    });
  } catch (err) {
    next(err);
  }
});

// Página de cadastro
router.get('/cadastro', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/cadastro', {
    title: 'Cadastro',
    page: 'cadastro',
    error: null,
    success: null
  });
});

// Processar cadastro
router.post('/cadastro', async (req, res, next) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;

    // Validações
    if (senha !== confirmarSenha) {
      return res.render('auth/cadastro', {
        title: 'Cadastro',
        page: 'cadastro',
        error: 'As senhas não coincidem',
        success: null 
      });
    }

    if (senha.length < 6) {
      return res.render('auth/cadastro', {
        title: 'Cadastro',
        page: 'cadastro',
        error: 'A senha deve ter pelo menos 6 caracteres',
        success: null
      });
    }

    // Verificar se email já existe
    const exists = await Hospede.findOne({ email }).lean();
    if (exists) {
      return res.render('auth/cadastro', {
        title: 'Cadastro',
        page: 'cadastro',
        error: 'Este email já está cadastrado',
        success: null
      });
    }

    // Criar novo usuário
    await Hospede.create({ 
      nome, 
      email, 
      senha, 
      tipo: 'cliente', 
      dataCadastro: new Date() 
    });
    
    return res.render('auth/cadastro', {
      title: 'Cadastro',
      page: 'cadastro',
      error: null,
      success: 'Cadastro realizado com sucesso! Faça login para continuar.'
    });
  } catch (err) {
    next(err);
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

export default router;
