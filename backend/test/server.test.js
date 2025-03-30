const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');  // Import the Express app

describe('Auth API Tests', function () {
    it('should return 400 if username or password is missing', function (done) {
        request(app)
            .post('/api/login')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.equal('Username and password are required');
                done();
            });
    });

    it('should return 401 if credentials are incorrect', function (done) {
        request(app)
            .post('/api/login')
            .send({ username: 'dikshit', password: 'wrong' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.equal('Invalid username or password');
                done();
            });
    });

    it('should return a JWT token for valid credentials', function (done) {
        request(app)
            .post('/api/login')
            .send({ username: 'dikshit', password: 'password123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });
});
