// settings.js focado em fazer o UI funcionar

module.exports = {
    // Habilita a segurança do editor de fluxos
    /* adminAuth: {  // Comentado por enquanto
        type: "credentials",
        users: [{
            username: process.env.NODE_RED_USERNAME,
            password: process.env.NODE_RED_PASSWORD,
            permissions: "*"
        }]
    }, */
    
    // HABILITA A SEGURANÇA DO DASHBOARD E OUTROS ENDPOINTS HTTP
    httpNodeAuth: {
        user: process.env.NODE_RED_HTTP_USERNAME,
        pass: process.env.NODE_RED_HTTP_PASSWORD
    },
    
    // Garante que o Node-RED use o disco persistente do Render
    userDir: "./"
}