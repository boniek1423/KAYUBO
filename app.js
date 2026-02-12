const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // Nueva librería
const app = express();
const path = require('path');

// 1. Configuraciones de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// 3. Configuración de Sesiones (Cookies)
app.use(cookieSession({
    name: 'session',
    keys: ['clave-secreta-de-kayubo-2026'], // Firma la cookie
    maxAge: 24 * 60 * 60 * 1000 // La sesión dura 24 horas
}));

// --- CONEXIÓN A MONGO DB ATLAS ---
// RECUERDA: Reemplaza <password> con tu contraseña real de Atlas
const mongoURI = "mongodb+srv://boniekmedina_db_user:1423Kata.10@cluster0.cp45r6o.mongodb.net/kayubo?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// --- MODELOS DE DATOS ---

// Modelo para las Noticias
const Noticia = mongoose.model('Noticia', new mongoose.Schema({
    titulo: String,
    autor: String,
    fecha: String
}));

// Modelo para los Usuarios Administradores
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String }
}));

// --- RUTAS DE ACCESO (LOGIN) ---

// Ver el formulario de login
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Procesar el inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Usuario.findOne({ username, password });
        if (user) {
            req.session.adminId = user._id; // Creamos la sesión
            res.redirect('/admin');
        } else {
            res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        res.status(500).send("Error en el servidor");
    }
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

// --- RUTAS DE CONTENIDO ---

// Ruta Principal (Pública)
app.get('/', async (req, res) => {
    const noticiasDB = await Noticia.find().sort({ _id: -1 });
    res.render('index', { usuario: 'Invitado', noticias: noticiasDB });
});

// Ruta del Panel Admin (Protegida)
app.get('/admin', async (req, res) => {
    if (!req.session.adminId) return res.redirect('/login'); // Validador de sesión

    const noticiasDB = await Noticia.find().sort({ _id: -1 });
    res.render('admin', { noticias: noticiasDB });
});

// Guardar noticia (Protegida)
app.post('/nueva-noticia', async (req, res) => {
    if (!req.session.adminId) return res.status(403).send("No autorizado");

    const { titulo, autor } = req.body;
    const fechaActual = new Date().toLocaleString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    await Noticia.create({ titulo, autor, fecha: fechaActual });
    res.redirect('/admin');
});

// Borrar noticia (Protegida)
app.post('/borrar-noticia', async (req, res) => {
    if (!req.session.adminId) return res.status(403).send("No autorizado");

    await Noticia.findByIdAndDelete(req.body.id);
    res.redirect('/admin');
});

// --- INICIO DEL SERVIDOR ---
if (process.env.NODE_ENV !== 'production') {
    const port = 3000;
    app.listen(port, () => console.log(`Corriendo en http://localhost:${port}`));
}

module.exports = app;