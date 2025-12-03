const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS erlauben für Buzzer-App Integration
app.use(cors());

// Statische Dateien servieren
app.use(express.static('public'));
app.use('/Logo', express.static('Logo'));
app.use('/Song', express.static('Song'));

// Route für Hauptseite
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API-Endpunkt für Buzzer-Integration
app.get('/api/buzzer-status', (req, res) => {
    // Hier kannst du später Daten von der Buzzer-App abrufen
    res.json({ 
        status: 'ready',
        message: 'Buzzer API ist bereit'
    });
});

app.listen(PORT, () => {
    console.log(`🎮 Quiz Show App läuft auf Port ${PORT}`);
    console.log(`🌐 Öffne: http://localhost:${PORT}`);
});
