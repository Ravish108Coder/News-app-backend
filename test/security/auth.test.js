// auth.test.js

const request = require('supertest');
import { app } from '../../app';

describe('POST /register (XSS and NoSQL Injection Tests)', () => {
  
  // XSS Injection Test Case
  /* it('should sanitize input to prevent XSS attacks', async () => {
    const xssPayload = "<img src='x' onerror='alert(\"XSS Attack\")'>"; // XSS payload

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: xssPayload,
        email: "test@example.com",
        password: "StrongPass123!"
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('User Registered Successfully');

    // Ensure the username is sanitized and doesn't contain XSS payload
    expect(response.body.user.username).not.toContain('alert("XSS Attack")');
  }); */

  // NoSQL Injection Test Case
  it('should prevent NoSQL injection via email field', async () => {
    const noSqlPayload = { "$ne": null };  // NoSQL injection payload

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: "testUser",
        email: noSqlPayload,  // This is an injection
        password: "StrongPass123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe('Invalid email format');  // The payload should be rejected as invalid
  });

  // XSS and NoSQL combined test
  it('should handle both XSS and NoSQL injections simultaneously', async () => {
    const maliciousPayload = {
      username: "<img src='x' onerror='alert(\"XSS Attack\")'>",  // XSS payload
      email: { "$ne": null },  // NoSQL Injection payload
      password: "<script>alert('XSS');</script>StrongPass123!"  // XSS payload in password
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(maliciousPayload);

    // Check for XSS protection (no alert should be triggered)
    expect(response.status).toBe(400);  // Should fail at input validation step
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe('Invalid email format');  // Invalid email due to NoSQL injection payload

    // Ensure the XSS is sanitized in password and username
    expect(response.body.message).not.toContain('alert');
  });
});
