import conexao from '../config/conexao.js';

const hospedeSchema = new conexao.Schema({
  nome: { type: String, required: true },
  CPF: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  dataNascimento: { type: Date, required: true },
  senha: { type: String, required: true },
  tipo: { type: String, default: 'hospede' },
  telefone: { type: String },
  endereco: { type: String },
  dataCadastro: { type: Date, default: Date.now }
}, { timestamps: true });

const Hospede = conexao.model('Hospede', hospedeSchema);
export default Hospede;
 