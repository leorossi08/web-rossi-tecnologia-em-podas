const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = 3001;

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
// ---------------------------------------------

// Rota para o envio de e-mail
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // --- Opções do e-mail ATUALIZADO ---
  // Agora lendo os e-mails do arquivo .env
  const mailOptions = {
    from: process.env.FROM_EMAIL, // E-mail do remetente
    to: process.env.TO_EMAIL,       // E-mail do destinatário
    replyTo: email,                  // Faz o botão "Responder" ir para o e-mail do cliente
    subject: `Nova mensagem do site Rossi Tecnologia em Podas:${name}`,
    html: `
      <h2>Nova Mensagem do Formulário de Contato</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email do Remetente:</strong> ${email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${message}</p>
    `,
  };
  // ------------------------------------

  // Enviando o e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
      return res.status(500).send('Erro ao enviar o e-mail.');
    }
    console.log('E-mail enviado: ' + info.response);
    res.status(200).send('E-mail enviado com sucesso!');
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});