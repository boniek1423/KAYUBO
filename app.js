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
// Definimos nuestra contraseña (puedes cambiarla por lo que quieras)
const CLAVE_SECRETA = "kayubo123";

// 4. Ruta del Panel Admin (Con protección sencilla)
app.get('/admin', (req, res) => {
    const key = req.query.key; // Buscamos ?key=... en la URL

    if (key === CLAVE_SECRETA) {
        res.render('admin');
    } else {
        // Si la clave no es correcta, lo mandamos al home
        res.redirect('/');
    }
});

// 5. Lógica para GUARDAR noticias (Protegida)
app.post('/nueva-noticia', (req, res) => {
    const { titulo, autor, pass } = req.body; // Añadimos 'pass'
    
    if (pass === CLAVE_SECRETA) {
        noticias.unshift({ titulo, autor });
        res.redirect('/');
    } else {
        res.send("<h1>Acceso denegado: Clave incorrecta</h1>");
    }
});

// 6. Ruta de Contacto
app.post('/contacto', (req, res) => {
    res.render('exito', { nombre: req.body.nombre });
});

// 7. Lógica para BORRAR noticias
app.post('/borrar-noticia', (req, res) => {
    const { index, pass } = req.body;

    if (pass === CLAVE_SECRETA) {
        // Eliminamos el elemento del array usando su posición (index)
        noticias.splice(index, 1);
        // Redirigimos de nuevo al admin con la clave para seguir editando
        res.redirect(`/admin?key=${CLAVE_SECRETA}`);
    } else {
        res.status(403).send("Acceso denegado");
    }
});

if (process.env.NODE_ENV !== 'production') {
    const port = 3000;
    app.listen(port, () => console.log(`Corriendo en http://localhost:${port}`));
}

module.exports = app;