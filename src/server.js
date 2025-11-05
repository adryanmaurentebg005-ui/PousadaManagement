import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3111;
 
// Configuração do EJS
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
 
// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(methodOverride('_method'));

// Sessão
app.use(session({
  secret: 'pousada-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

 
// Middleware para disponibilizar usuário nas views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.tipo === 'admin';
  next();
});

// Importar rotas (ESM)
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import quartosRoutes from './routes/quartos.js';
import reservasRoutes from './routes/reservas.js';
import adminRoutes from './routes/admin.js';
import perfilRoutes from './routes/perfil.js';

//import { connect } from './config/conexao.js';

// Usar rotas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/quartos', quartosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/admin', adminRoutes);
app.use('/perfil', perfilRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
