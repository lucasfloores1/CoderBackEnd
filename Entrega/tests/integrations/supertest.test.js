import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('E-commerce Testing', async function () {
    describe('Auth Testing',  async function () {
        before( function () {
            this.email = `test${Date.now()/1000}@email.com`;
            this.cookie = {};
        });
        it('Register test', async function () {
            const userMock = {
                first_name : 'Test',
                last_name : 'User',
                email : this.email,
                age : '24',
                password : 'password',
                role : 'admin',
                cart : '123cartId'
            };
            const {
                statusCode,
                ok,
                _body,
            } = await requester.post('/api/auth/register').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('status');
        });

        it('Login Test', async function () {
            const userMock = {
                email : this.email,
                password : 'password'
            }
            const {
                headers,
                statusCode,
                ok,
              } = await requester.post('/api/auth/login').send(userMock);
              expect(statusCode).to.be.equal(200);
              expect(ok).to.be.ok;
              const cookieParts = headers['set-cookie'][0].split(/;|=/);
              const key = cookieParts[0];
              const value = cookieParts[1];
              this.cookie.key = key;
              this.cookie.value = value;
        });

        it('Current Test', async function () {
            const {
                statusCode,
                ok,
                _body,
              } = await requester
                .get('/api/auth/current')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
              expect(statusCode).to.be.equal(200);
              expect(ok).to.be.ok;
              expect(_body).to.be.has.property('payload');
              expect(_body.payload).to.be.has.property('email', this.email);
        });
    });
});