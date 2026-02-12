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
        // Creamos un objeto de fecha y lo formateamos
        const fechaActual = new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Guardamos la noticia incluyendo la fecha
        noticias.unshift({ 
            titulo, 
            autor, 
            fecha: fechaActual // <-- Nueva propiedad
        });
        
        res.redirect(`/admin?key=${CLAVE_SECRETA}`);
    } else {
        res.status(403).send("Acceso denegado");
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