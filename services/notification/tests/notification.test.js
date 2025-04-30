const request = require('supertest');
const app = require('../src/app.js');
const sqlite3 = require('sqlite3').verbose();

describe('Notification Endpoints', () => {
  let db;

  beforeAll((done) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Database connection error:', err);
        done(err);
      } else {
        console.log('Connected to the in-memory SQLite database.');
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )`, (err) => {
            if (err) {
              console.error('Error creating table:', err);
              done(err);
            } else {
              console.log('Notification table created.');
              done();
            }
          });
        });
      }
    });
  });

  afterAll((done) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed.');
      }
      done();
    });
  });

  it('should send a notification to a user', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({
        user: 'testuser',
        message: 'Test notification'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Notification sent');
  });

  it('should get all notifications for a user', async () => {
    // First send a notification
    await request(app)
      .post('/notifications')
      .send({
        user: 'testuser2',
        message: 'Test notification 2'
      });

    const res = await request(app)
      .get('/notifications/testuser2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});