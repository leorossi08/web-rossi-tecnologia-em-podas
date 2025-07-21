// backend-email/send-email.js (VERSÃO NATIVA DO NETLIFY - RECOMENDADA)

const nodemailer = require('nodemailer');

// A função handler é o ponto de entrada para o Netlify
exports.handler = async function(event, context) {
  // O event.httpMethod verifica se a requisição é um POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Os dados do formulário vêm no corpo do evento, como uma string JSON
    const { name, email, message } = JSON.parse(event.body);

    console.log('Dados recebidos:', { name, email, message });

    // Pega as variáveis de ambiente (já estão disponíveis no contexto da função)
    const fromEmail = process.env.FROM_EMAIL;
    const toEmail = process.env.TO_EMAIL;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    // Validação para garantir que as variáveis foram carregadas
    if (!fromEmail || !toEmail || !sendgridApiKey) {
        throw new Error("Variáveis de ambiente de e-mail não configuradas.");
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: sendgridApiKey,
      },
    });

    console.log('Tentando enviar o e-mail...');

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Nova mensagem de contato de ${name}`,
      html: `
        <h2>Nova Mensagem do Formulário de Contato de Rossi Tecnologia em Podas</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email do Remetente:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log('E-mail enviado com sucesso!');

    // Retorna uma resposta de sucesso para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail enviado com sucesso!' }),
    };

  } catch (error) {
    console.error('ERRO DETALHADO:', error);
    // Retorna uma resposta de erro para o frontend
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao enviar o e-mail.' }),
    };
  }
};