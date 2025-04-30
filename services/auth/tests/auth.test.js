const request = require('supertest');
const app = require('../src/app.js');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

describe('Auth Endpoints', () => {
  let db;
  let server;

  beforeAll((done) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Database connection error:', err);
        done(err);
      } else {
        console.log('Connected to the in-memory SQLite database.');
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
          )`, (err) => {
            if (err) {
              console.error('Error creating table:', err);
              done(err);
            } else {
              console.log('User table created.');
              server = http.createServer(app);
              server.listen(3001, () => {
                console.log('Test server listening on port 3001');
                done();
              });
            }
          });
        });
      }
    });
  });

  afterAll((done) => {
    server.close(async (err) => {
      if (err) {
        console.error('Error closing server:', err);
      }
      await db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed.');
        }
        done();
      });
    });
  });

  it('should register a new user', async () => {
    const res = await request(server)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
      .timeout(10000);
    expect(res.statusCode).toEqual(201);
  }, 10000);

  it('should login an existing user', async () => {
    // First register the user
    await request(server)
      .post('/register')
      .send({
        email: 'test2@example.com',
        password: 'password'
      })
      .timeout(10000);

    const res = await request(server)
      .post('/login')
      .send({
        email: 'test2@example.com',
        password: 'password'
      })
      .timeout(10000);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  }, 10000);

  it('should not login with invalid credentials', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .timeout(10000);
    expect(res.statusCode).toEqual(401);
  }, 10000);
});