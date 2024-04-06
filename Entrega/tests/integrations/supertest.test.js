import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

describe('E-commerce Testing', async function () {
    
    beforeEach( async function () {
        if (!this.user) {
            this.email = `test${Date.now()/1000}@email.com`;
            this.cookie = {};
            this.user = {};
            this.product = {};

            await registerUser.call(this);
            await loginUser.call(this);
            await currentUser.call(this);
            await createProduct.call(this); 
        }
    });

    async function registerUser() {
        const userMock = {
            first_name : 'Test',
            last_name : 'User',
            email : this.email,
            age : '24',
            password : 'password',
            role : 'admin',
        };
        const {
            statusCode,
            ok,
            _body,
        } = await requester.post('/api/auth/register').send(userMock);
    }

    async function loginUser() {
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
    }

    async function currentUser() {
        const {
            _body,
          } = await requester
            .get('/api/auth/current')
            .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
          this.user = _body.payload;
    };

    async function createProduct() {
        const {
             _body,
        } = await requester
            .post(`/api/products`)
            .field('code', `${Date.now()/1000}test`)
            .field('title', 'Test Product')
            .field('description', 'Test description')
            .field('price', 50)
            .field('stock', 100)
            .field('type', 'Type test 1')
            .field('owner', this.user.id)
            .field('isAdmin', true)
            .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
        this.product = _body.payload
    }

    describe('Auth Testing',  async function () {

        before( function () {
            this.email = `test${Date.now()/100}@email.com`;
            this.cookie = {};
        });

        it('Register', async function () {
            const userMock = {
                first_name : 'Test',
                last_name : 'User',
                email : this.email,
                age : '24',
                password : 'password',
                role : 'admin',
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

        it('Login', async function () {
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

        it('Current', async function () {
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
              this.user = _body.payload
        });
    });

    describe('Carts Testing', async function () {

        it('Get a single cart', async function () {
            const {
                statusCode,
                ok,
                _body,
              } = await requester
                .get(`/api/carts/${this.user.cart_id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('products');
            expect(_body.payload).to.be.has.property('total');
        });

        it('Add a product to a cart', async function (){
            const {
                statusCode,
                ok,
                _body,
              } = await requester
                .post(`/api/carts/${this.user.id}/products/${this.product.id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('products');
            expect(_body.payload).to.be.has.property('total');
        });

        it('Buy a cart', async function (){
            const {
                statusCode,
                ok,
                _body,
              } = await requester
                .post(`/api/carts/${this.user.cart_id}/purchase`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('code');
            expect(_body.payload).to.be.has.property('amount');
            expect(_body.payload).to.be.has.property('purchaser');
            expect(_body.payload).to.be.has.property('purchase_datetime');
        });
    });

    describe('Products Testing', async function () {

        it('Get a single product', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get(`/api/products/${this.product.id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('title');
            expect(_body.payload).to.be.has.property('description');
            expect(_body.payload).to.be.has.property('price');
            expect(_body.payload).to.be.has.property('code');
            expect(_body.payload).to.be.has.property('stock');
            expect(_body.payload).to.be.has.property('thumbnails');
            expect(_body.payload).to.be.has.property('type');
            expect(_body.payload).to.be.has.property('owner');
            expect(_body.payload).to.be.has.property('isAdmin');
        });

        it('Create a product', async function () {
            const {
                statusCode,
                ok,
                _body,
           } = await requester
               .post(`/api/products`)
               .field('code', `${Date.now()/1000}test`)
               .field('title', 'Test Product')
               .field('description', 'Test description')
               .field('price', 50)
               .field('stock', 100)
               .field('type', 'Type test 1')
               .field('owner', this.user.id)
               .field('isAdmin', this.user.isAdmin)
               .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('title');
            expect(_body.payload).to.be.has.property('description');
            expect(_body.payload).to.be.has.property('price');
            expect(_body.payload).to.be.has.property('code');
            expect(_body.payload).to.be.has.property('stock');
            expect(_body.payload).to.be.has.property('thumbnails');
            expect(_body.payload).to.be.has.property('type');
            expect(_body.payload).to.be.has.property('owner');
            expect(_body.payload).to.be.has.property('isAdmin');

        });

        it('Update a product', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .put(`/api/products/${this.product.id}`).send({ description : 'Test Update Description' })
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.payload).to.be.has.property('id');
            expect(_body.payload).to.be.has.property('title');
            expect(_body.payload).to.be.has.property('description');
            expect(_body.payload).to.be.has.property('price');
            expect(_body.payload).to.be.has.property('code');
            expect(_body.payload).to.be.has.property('stock');
            expect(_body.payload).to.be.has.property('thumbnails');
            expect(_body.payload).to.be.has.property('type');
            expect(_body.payload).to.be.has.property('owner');
            expect(_body.payload).to.be.has.property('isAdmin');
        });

        it('Delete a product', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .delete(`/api/products/${this.product.id}/user/${this.user.id}`)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('status');           
        });
    });
});