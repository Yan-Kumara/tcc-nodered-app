// Importa o módulo de criptografia do Node.js
const crypto = require('crypto');

module.exports = {
    // Segurança do Editor (Admin) - Usando o método seguro
    adminAuth: {
        type: "credentials",
        users: [{
            username: process.env.NODE_RED_USERNAME,
            password: process.env.NODE_RED_PASSWORD_HASH,
            permissions: "*"
        }]
    },

    // A MÁGICA ACONTECE AQUI: O Middleware de Segurança
    httpNodeMiddleware: function(req, res, next) {
        // Ignora a verificação para o ícone (favicon)
        if (req.path === '/favicon.ico') {
            return next();
        }

        const a_user = process.env.NODE_RED_USERNAME;
        const a_pass_hash = process.env.NODE_RED_PASSWORD_HASH;

        // Se o usuário ou a senha não estiverem configurados nas variáveis de ambiente,
        // o sistema fica aberto. Você pode mudar para `res.status(500).send...` se preferir bloquear.
        if (!a_user || !a_pass_hash) {
            console.log("AVISO: NODE_RED_USERNAME ou NODE_RED_PASSWORD_HASH não definidos. Acesso liberado.");
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Node-RED UI"');
            return res.status(401).send('Autenticação necessária.');
        }

        const encodedCreds = authHeader.split(' ')[1];
        const decodedCreds = Buffer.from(encodedCreds, 'base64').toString('utf8');
        const [user, pass] = decodedCreds.split(':');

        // Compara o nome de usuário fornecido com o esperado
        const userMatch = crypto.timingSafeEqual(Buffer.from(user), Buffer.from(a_user));

        if (userMatch) {
            // Se o usuário bate, agora comparamos a senha com o hash
            // Usando o módulo `bcrypt` que o Node-RED já inclui
            const bcrypt = require('bcryptjs');
            bcrypt.compare(pass, a_pass_hash, function(err, result) {
                if (result) {
                    // Senha correta! Permite o acesso.
                    next();
                } else {
                    // Senha incorreta.
                    res.setHeader('WWW-Authenticate', 'Basic realm="Node-RED UI"');
                    res.status(401).send('Credenciais inválidas.');
                }
            });
        } else {
            // Usuário incorreto.
            res.setHeader('WWW-Authenticate', 'Basic realm="Node-RED UI"');
            res.status(401).send('Credenciais inválidas.');
        }
    },

    // Garante que o Node-RED use o disco persistente do Render
    userDir: "./",

    // Outras configurações...
    flowFile: 'flows.json'
};