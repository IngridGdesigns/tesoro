const request = require('supertest');
const app = require('../server');
jest.useFakeTimers('legacy')

// Tests hangs, can't detect "OpenHandles" yet, needs debugging

describe('Testing home route and authenticated route', () => {
    //public route, anyone can visit
    it('responds to / as public route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual('\"hello and welcome to home for now\"');
    });
    //private route, only validated users, missing jwt Token on purpose - expected to fail
    it('expect to fail responds to /hello, private route protected by Auth0', async () => {
        const res = await request(app).get('/hello');
        expect(res.header['content-type']).toBe('text/html; charset=utf-8');
        expect(res.statusCode).toBe(401);
        expect(res.text).toContain('UnauthorizedError: Unauthorized');
      /*
      Object output it receives when expect(res.text).toThrowError(TypeError)
      {"header": {"connection": "close", "content-length": "6430", "content-security-policy": "default-src 'none'", 
      "content-type": "text/html; charset=utf-8", "date": "Tue, somedate GMT", "www-authenticate": "Bearer realm=\"api\"",
       "x-content-type-options": "nosniff", "x-powered-by": "Express"}, "req": {"data": undefined, "headers": {}, "method": "GET", 
       "url": "http://localhost/hello"}, "status": 401, "text": "<!DOCTYPE html>... etc <pre>UnauthorizedError: Unauthorized
      */
        
    });

});
