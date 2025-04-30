const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const { time, timeStamp } = require('console');
const { eventNames } = require('process');
// const { debug } = require('console');
require('dotenv').config();


// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'chat-service.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Database setup
const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) logger.error('Database connection error:', err);
  else logger.info('Connected to SQLite database');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Swagger setup
const swaggerDoc = YAML.load('./docs/swagger.yaml');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST",'HEAD','PUT','PATCH','DELETE']
  }
});

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// WebSocket logic
io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  const clientPort = socket.handshake.port;
  const connectionTimestamp = new Date().toISOString();
  logger.info(`[${connectionTimestamp}] User connected: ${socket.id}, IP: ${clientIp}, Port: ${clientPort}`);
  socket.emit('welcome', {sender:'server', text : 'Welcome to the chat service!',timestamp: connectionTimestamp});


  socket.on('newMessage', (msg) => {
    const receiveTimestamp = new Date().toISOString();
    logger.info(`[${receiveTimestamp}] Received message from ${socket.id}: ${msg.sender} - ${msg.text}`);
    db.run('INSERT INTO messages (user, message) VALUES (?, ?)', [msg.sender, msg.text], function(err) {
      if (err) {
        logger.error(`[${new Date().toISOString()}] Error saving message from ${socket.id}:`, err);
      } else {
        db.get('SELECT * FROM messages WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            logger.error(`[${new Date().toISOString()}] Error retrieving message with ID ${this.lastID}:`, err);
          } else {
            socket.broadcast.emit('defusion', { id: row.id, sender:row.user, text: row.message, timestamp:row.timestamp }); // Send message ID back to sender

          }
        });
      }

    });
  });

  socket.on('disconnect', (reason) => {
    const disconnectTimestamp = new Date().toISOString();
    logger.info(`[${disconnectTimestamp}] User disconnected: ${socket.id}, Reason: ${reason}`);
    logger.info('A user disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  logger.info(`Chat service running on port ${PORT}`);
});