const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const winston = require('winston');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();


// Initialize logger
const logger = winston.createLogger({
  level: [winston.info, winston.error, winston.debug, winston.warn],
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'auth-service.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Database setup
const db = new sqlite3.Database('./auth.db', (err) => {
  if (err) logger.error('Database connection error:', err);
  else logger.info('Connected to SQLite database');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`, (err) => {
    if (err) logger.error('Error creating table:', err);
    else logger.info('User table created or already exists');
  }
  );
});

// Swagger setup
const swaggerDoc = YAML.load('./docs/swagger.yaml');

const app = express();
app.use(express.json());
app.use(cors());
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Security headers middleware
app.use(cors({
  origin: ['http://localhost:80','http://localhost'], // Replace with your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use((req, res, next) => {
//   // res.setHeader('X-Content-Type-Options', 'nosniff');
//   // res.setHeader('X-Frame-Options', 'DENY');
//   res.setheader('Access-Control-Allow-Methods', 'GET, POST');//, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-origins', 'http://localhost:80, http://localhost');
//   // res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:* http://127.0.0.1:*");
//   next();
// });

// Routes
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', 
      [req.body.email, hashedPassword],
      (err) => {
        if (err) {
          logger.error('Error inserting user:', err);
          return res.status(400).send('User already exists');
        }
        res.status(201).send('User created');
        logger.info(`User registered: ${req.body.email}`);    });
  } catch {
    res.status(500).send();
  }
});

app.post('/login', (req, res) => {
  db.get('SELECT * FROM users WHERE email = ?', [req.body.email], 
    async (err, user) => {
      if (err || !user || !await bcrypt.compare(req.body.password, user.password)) {
        logger.debug('Login attempt:', req.body.email);
        if (err) logger.error('Error fetching user:', err);
        else logger.warn('User not found or password mismatch:', req.body.email);
        // Log the failed login attempt
        logger.error('Login failed for user:', req.body.email);
        return res.status(401).send('Invalid credentials');
      }
      logger.info(`User logged in: ${req.body.email}`);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
});