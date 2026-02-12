const express = require('express');
const app = express();
const path = require('path');

// Configuramos EJS como el motor de vistas
app.set('view engine', 'ejs');

// ESTA LÍNEA ES LA CLAVE:
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const noticias = [
        { titulo: 'Node.js es veloz', autor: 'Admin' },
        { titulo: 'Vercel es genial', autor: 'Soporte' }
    ];
    
    // Renderizamos 'index.ejs' y le pasamos los datos
    res.render('index', { 
        usuario: 'Programador', 
        noticias: noticias 
    });
});

// Para desarrollo local (Vercel usará su propia gestión)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('http://localhost:3000'));
}

module.exports = app;