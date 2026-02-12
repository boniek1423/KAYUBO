const express = require('express');
const app = express();
const path = require('path');

// 1. Configuraciones de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// --- VARIABLES GLOBALES (Mantenlas aquí arriba) ---
const CLAVE_SECRETA = "kayubo123"; // <--- MOVIDA AQUÍ PARA QUE TODOS LA VEAN
let noticias = [
    { titulo: 'Node.js es veloz', autor: 'Admin' },
    { titulo: 'Vercel es genial', autor: 'Soporte' }
];

// 3. Ruta Principal
app.get('/', (req, res) => {
    res.render('index', { 
        usuario: 'Programador', 
        noticias: noticias 
    });
});

// 4. Ruta del Panel Admin
app.get('/admin', (req, res) => {
    const llaveIngresada = req.query.key;

    if (llaveIngresada === CLAVE_SECRETA) {
        res.render('admin', { noticias: noticias }); 
    } else {
        res.redirect('/');
    }
});

// 5. Lógica para GUARDAR noticias
app.post('/nueva-noticia', (req, res) => {
    const { titulo, autor, pass } = req.body;
    
    if (pass === CLAVE_SECRETA) {
        noticias.unshift({ titulo, autor });
        // Redirigimos al admin con la clave para ver el cambio
        res.redirect(`/admin?key=${CLAVE_SECRETA}`);
    } else {
        res.status(403).send("<h1>Acceso denegado: Clave incorrecta</h1>");
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
        noticias.splice(index, 1);
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