const express = require('express');
const app = express();
const path = require('path');

// CONFIGURACIÓN CRÍTICA PARA VERCEL
app.set('view engine', 'ejs');
// Esta línea le dice a Vercel exactamente dónde está la carpeta views
app.set('views', path.join(__dirname, 'views')); 

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const noticias = [
        { titulo: 'Node.js es veloz', autor: 'Admin' },
        { titulo: 'Vercel es genial', autor: 'Soporte' }
    ];
    
    res.render('index', { 
        usuario: 'Programador', 
        noticias: noticias 
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('http://localhost:3000'));
}

module.exports = app;