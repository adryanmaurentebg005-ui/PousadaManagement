import express from 'express';
import { Hospede, Quarto, Reserva, Pagamento } from '../models/index.js';

const router = express.Router();

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

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

// Página do perfil

router.get('/', requireAuth, async (req, res) => {
  const user = req.session.user;
  const { email } = user;

  try {
    // 1️⃣ Buscar hóspede pelo e-mail
    const hospede = await Hospede.findOne({ email }).lean();
    if (!hospede) {
      return res.render('perfil/index', {
        title: 'Meu Perfil',
        page: 'perfil',
        user,
        hospede: null,
        reservas: [],
        success: null,
        error: 'Hóspede não encontrado'
      });
    }

    const reservasUsuario = await Reserva.find({ hospede: hospede._id })
  .populate('quarto')
  .populate('hospede')
  .sort({ criadoEm: -1 })
  .lean();


    // 3️⃣ Renderizar a view com os dados
 
    res.render('perfil/index', {
      title: 'Meu Perfil',
      page: 'perfil',
      user,
      hospede,
      reservas: reservasUsuario,
      success: null,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

// Página de configurações
router.get('/configuracoes', requireAuth, (req, res) => {
  res.render('perfil/configuracoes', {
    title: 'Configurações',
    page: 'perfil',
    success: null,
    error: null
  });
});

// Atualizar perfil
router.post('/atualizar', requireAuth, async (req, res) => {
  const { nome, telefone, endereco, dataNascimento } = req.body;
  const user = req.session.user;

  try {
    await Hospede.updateOne({ email: user.email }, {
      nome, telefone, endereco, dataNascimento
    });

    req.session.user.nome = nome;
    res.redirect('/perfil?success=perfil');
  } catch (err) {
    console.error(err);
    res.redirect('/perfil?error=update');
  }
});

// Mudar senha
router.post('/mudar-senha', requireAuth, (req, res) => {
  const { senhaAtual, novaSenha, confirmarSenha } = req.body;
  const user = req.session.user;

  if (user.senha !== senhaAtual) {
    return res.render('perfil/configuracoes', {
      title: 'Configurações',
      page: 'perfil',
      error: 'Senha atual incorreta',
      success: null
    });
  }

  if (novaSenha !== confirmarSenha) {
    return res.render('perfil/configuracoes', {
      title: 'Configurações',
      page: 'perfil',
      error: 'As novas senhas não coincidem',
      success: null
    });
  }

  if (novaSenha.length < 6) {
    return res.render('perfil/configuracoes', {
      title: 'Configurações',
      page: 'perfil',
      error: 'A senha deve ter pelo menos 6 caracteres',
      success: null
    });
  }

  user.senha = novaSenha;
  req.session.user.senha = novaSenha;

  res.render('perfil/configuracoes', {
    title: 'Configurações',
    page: 'perfil',
    error: null,
    success: 'Senha alterada com sucesso!'
  });
});

export default router;
