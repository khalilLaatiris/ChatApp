const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'notification-service.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Database setup
const db = new sqlite3.Database('./notification.db', (err) => {
  if (err) logger.error('Database connection error:', err);
  else logger.info('Connected to SQLite database');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Swagger setup
const swaggerDoc = YAML.load('./docs/swagger.yaml');

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Routes
app.post('/notifications', (req, res) => {
  const { user, message } = req.body;
  db.run('INSERT INTO notifications (user, message) VALUES (?, ?)', [user, message], (err) => {
    if (err) {
      logger.error('Error saving notification:', err);
      return res.status(500).send('Error saving notification');
    }
    logger.info(`Notification sent to user ${user}: ${message}`);
    res.status(201).send('Notification sent');
  });
});

app.get('/notifications/:user', (req, res) => {
  const user = req.params.user;
  db.all('SELECT * FROM notifications WHERE user = ?', [user], (err, rows) => {
    if (err) {
      logger.error('Error retrieving notifications:', err);
      return res.status(500).send('Error retrieving notifications');
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
});