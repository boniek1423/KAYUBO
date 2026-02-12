const express = require('express');
const app = express();
const path = require('path');

// 1. Configuraciones de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares (Importante para el CSS y el Formulario)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para leer datos del formulario

// 3. Ruta Principal (GET)
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

// 4. Ruta del Formulario (POST)
app.post('/contacto', (req, res) => {
    const nombreUsuario = req.body.nombre;
    
    // Ahora renderizamos la nueva vista 'exito'
    res.render('exito', { 
        nombre: nombreUsuario 
    });
});

// 5. Servidor para modo local
if (process.env.NODE_ENV !== 'production') {
    const port = 3000;
    app.listen(port, () => console.log(`Corriendo en http://localhost:${port}`));
}

module.exports = app;