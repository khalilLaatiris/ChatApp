const request = require('supertest');
const app = require('../src/app.js');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require("socket.io");

describe('Chat Endpoints', () => {
  let db;
  let server;
  let io;

  beforeAll((done) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Database connection error:', err);
        done(err);
      } else {
        console.log('Connected to the in-memory SQLite database.');
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )`, (err) => {
            if (err) {
              console.error('Error creating table:', err);
              done(err);
            } else {
              console.log('Message table created.');
              // Start the server
              const appInstance = app;
              server = http.createServer(appInstance);
              io = new Server(server);
              appInstance.io = io; // Attach io to the app instance
              server.listen(3002, () => {
                console.log('Test server listening on port 3002');
                done();
              });
            }
          });
        });
      }
    });
  });

  afterAll((done) => {
    io.close();
    server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
      }
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed.');
        }
        done();
      });
    });
  });

  it('should get all messages', async () => {
    const res = await request(app).get('/messages');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});