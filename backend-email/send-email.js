
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const serverless = require('serverless-http'); // Importa a biblioteca
require('dotenv').config();

const app = express();

// O Netlify gerencia as rotas, então criamos um router do Express
const router = express.Router();

// Middlewares
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
// Note que a rota agora é a raiz '/', pois o caminho completo será gerenciado pelo Netlify
router.post('/', (req, res) => {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
      return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
    }
    console.log('E-mail enviado: ' + info.response);
    res.status(200).json({ success: 'E-mail enviado com sucesso!' });
  });
});

// --- Configuração para o Netlify ---
// O caminho base para a nossa rota será '/.netlify/functions/send-email'
app.use('/.netlify/functions/send-email', router);

// --- Exportação para o Netlify ---
// Removemos o app.listen e exportamos o handler
module.exports.handler = serverless(app);