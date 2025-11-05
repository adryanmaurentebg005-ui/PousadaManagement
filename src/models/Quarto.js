import conexao from '../config/conexao.js';
//import crypto from 'crypto'; // <- gera UUID

const quartoSchema = new conexao.Schema({
  id: { 
  type: String, 
  unique: true,
  default: () => Math.floor(100000 + Math.random() * 900000) // gera um número entre 100000 e 999999
},
  numero: { type: String, required: true },
  tipo: { type: String, required: true },
  capacidade: { type: Number, default: 1 },
  precoDiaria: { type: Number, default: 0 },
  descricao: { type: String },
  comodidades: [{ type: String }],
  imagem: { type: String },
  status: { type: String, default: 'Disponível' }
}, { timestamps: true });

// Se o modelo já existir (hot-reload / múltiplas importações), reutiliza.
const Quarto = conexao.models.Quarto || conexao.model('Quarto', quartoSchema);

export default Quarto;
 
