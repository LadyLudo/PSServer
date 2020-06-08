const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const oneApp = res.body[0];
                expect(oneApp).to.include.keys(
                    'Category', 'Rating', 'Type'
                )
            })
    })
    it('should return 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Sort must be either rating or app')
    })
    it('should return 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'MISTAKE'})
            .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casusal, Arcade, or Card')
    })
    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i< res.body.length -1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.rating < appAtI.rating) {
                        sorted = false;
                        break
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
})