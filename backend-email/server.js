// server.js

// 1. Importar os pacotes
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// 2. Inicializar o Express
const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta 3001 ou a definida no ambiente

// 3. Configurar os Middlewares
app.use(cors()); // Permite que seu frontend faça requisições para este servidor
app.use(express.json()); // Permite que o servidor entenda JSON

// 4. Criar a rota para envio de email
app.post('/send-email', (req, res) => {
    const { email, message } = req.body;

    // Validação simples para garantir que os dados chegaram
    if (!email || !message) {
        return res.status(400).json({ error: 'Email e mensagem são obrigatórios.' });
    }

    // Configuração do Nodemailer com as credenciais do .env
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou outro serviço como 'hotmail', 'yahoo', etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Definir o conteúdo do email que você vai receber
    const mailOptions = {
        from: `"${email}" <${process.env.EMAIL_USER}>`, // Mostra o email do remetente
        to: process.env.EMAIL_USER, // O email para onde a mensagem será enviada (o seu)
        subject: `Nova mensagem do site de ${email}`,
        text: `Você recebeu uma nova mensagem de contato:\n\nEmail: ${email}\nMensagem: ${message}`,
        html: `<p>Você recebeu uma nova mensagem de contato:</p>
               <ul>
                 <li><b>Email:</b> ${email}</li>
                 <li><b>Mensagem:</b> ${message}</li>
               </ul>`,
    };

    // 5. Enviar o email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar email:', error);
            return res.status(500).json({ error: 'Ocorreu um erro ao enviar o email.' });
        }
        console.log('Email enviado: ' + info.response);
        res.status(200).json({ success: 'Email enviado com sucesso!' });
    });
});

// 6. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});