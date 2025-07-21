// backend-email/send-email.js (VERSÃO DE DEPURAÇÃO)

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

// --- LOG DE DEPURAÇÃO 1: Verificando as variáveis de ambiente ---
console.log('--- INICIANDO FUNÇÃO ---');
console.log('SENDGRID_API_KEY existe?', !!process.env.SENDGRID_API_KEY);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('TO_EMAIL:', process.env.TO_EMAIL);
console.log('-------------------------');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// --- Configuração do Nodemailer com SendGrid ---
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// --- Rota de envio ---
router.post('/', (req, res) => {
  // --- LOG DE DEPURAÇÃO 2: Verificando a rota ---
  console.log('Rota POST / foi chamada.');
  console.log('Dados recebidos do formulário:', req.body);

  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject: `Nova mensagem de contato de ${name}`,
    html: `
      <h2>Nova Mensagem do Formulário de Contato</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email do Remetente:</strong> ${email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${message}</p>
    `,
  };

  // --- LOG DE DEPURAÇÃO 3: Antes de enviar ---
  console.log('Opções do e-mail montadas. Tentando enviar...');

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // --- LOG DE DEPURAÇÃO 4: Erro no envio ---
      console.error('ERRO DETALHADO AO ENVIAR:', error);
      return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
    }

    // --- LOG DE DEPURAÇÃO 5: Sucesso no envio ---
    console.log('SUCESSO! Resposta do SendGrid:', info.response);
    res.status(200).json({ success: 'E-mail enviado com sucesso!' });
  });
});

app.use('/.netlify/functions/send-email', router);

module.exports.handler = serverless(app);