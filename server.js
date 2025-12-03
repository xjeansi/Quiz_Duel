const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS erlauben für Buzzer-App Integration
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Logo', express.static(path.join(__dirname, 'Logo')));
app.use('/Song', express.static(path.join(__dirname, 'Song')));

// Health Check für Railway
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route für Hauptseite
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    const fallbackPath = path.join(__dirname, 'index.html');
    
    console.log('Versuche index.html zu laden...');
    console.log('Public path:', indexPath);
    console.log('Fallback path:', fallbackPath);
    
    // Versuche zuerst public/index.html
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.log('Public index.html nicht gefunden, versuche Fallback...');
            // Fallback zu root index.html
            res.sendFile(fallbackPath, (err2) => {
                if (err2) {
                    console.error('Keine index.html gefunden:', err2);
                    res.status(404).send(`
                        <html>
                            <body style="font-family: Arial; padding: 40px; text-align: center;">
                                <h1>🎮 Quiz Duel Server läuft</h1>
                                <p>Aber index.html wurde nicht gefunden.</p>
                                <p>Bitte stelle sicher, dass index.html in ./public/ oder im Root liegt.</p>
                                <hr>
                                <p><a href="/health">Server Health Check</a></p>
                            </body>
                        </html>
                    `);
                }
            });
        } else {
            console.log('✅ index.html erfolgreich geladen');
        }
    });
});

// API-Endpunkt für Buzzer-Integration
app.get('/api/buzzer-status', (req, res) => {
    res.json({ 
        status: 'ready',
        message: 'Buzzer API ist bereit',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    console.log('404 - Seite nicht gefunden:', req.url);
    res.status(404).send(`
        <html>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
                <h1>404 - Seite nicht gefunden</h1>
                <p>Die Seite ${req.url} existiert nicht.</p>
                <p><a href="/">Zurück zur Startseite</a></p>
            </body>
        </html>
    `);
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Interner Server-Fehler');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('==========================================');
    console.log(`🎮 Quiz Duel Server gestartet`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`📁 Root: ${__dirname}`);
    console.log(`⏰ Gestartet: ${new Date().toISOString()}`);
    console.log('==========================================');
});

