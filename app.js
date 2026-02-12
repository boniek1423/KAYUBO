const express = require('express');
const app = express();
const path = require('path');

// 1. Configuraciones de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- NUESTRA "BASE DE DATOS" TEMPORAL ---
// Sacamos la lista de la ruta GET para que sea global y modificable
let noticias = [
    { titulo: 'Node.js es veloz', autor: 'Admin' },
    { titulo: 'Vercel es genial', autor: 'Soporte' }
];

// 3. Ruta Principal (Muestra las noticias actuales)
app.get('/', (req, res) => {
    res.render('index', { 
        usuario: 'Programador', 
        noticias: noticias 
    });
});

// 4. Ruta del Panel Admin (Solo para ver el formulario de creación)
app.get('/admin', (req, res) => {
    res.render('admin');
});

// 5. Lógica para GUARDAR noticias
app.post('/nueva-noticia', (req, res) => {
    const { titulo, autor } = req.body;
    
    // Agregamos la nueva noticia al principio del array
    noticias.unshift({ titulo, autor });
    
    // Redirigimos al inicio para ver el cambio
    res.redirect('/');
});

// 6. Ruta de Contacto
app.post('/contacto', (req, res) => {
    res.render('exito', { nombre: req.body.nombre });
});

if (process.env.NODE_ENV !== 'production') {
    const port = 3000;
    app.listen(port, () => console.log(`Corriendo en http://localhost:${port}`));
}

module.exports = app;