import { expect } from "chai";
import { 
    generateProducts,
    createHash,
    isValidPassword,
} from "../../src/utils/utils.js";

describe('Utils testing', function () {
    it('Should return an array of 15 products (mocking)', async function (){
        const result = generateProducts(15);
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.equals(15);
        expect(result[0]).to.have.property('id');
        expect(result[0]).to.have.property('title');
        expect(result[0]).to.have.property('description');
        expect(result[0]).to.have.property('price');
        expect(result[0]).to.have.property('code');
        expect(result[0]).to.have.property('stock');
        expect(result[0]).to.have.property('thumbnails');
        expect(result[0]).to.have.property('type');
    });

    it('Should hash a password correctly', async function (){
        const password = 'test';
        const result = createHash(password);
        expect(result).to.be.not.equals(password);
    });

    it('Should validate the password', async function (){
        const password = 'test';
        const hashedPassword = createHash(password);
        const userMock = { password : hashedPassword };
        const result = isValidPassword(password, userMock);
        expect(result).to.be.ok;
    });

    it('Should validate the invalid password', async function (){
        const password = 'test';
        const hashedPassword = createHash(password);
        const userMock = { password : hashedPassword };
        const result = isValidPassword('asdkljn', userMock);
        expect(result).to.be.not.ok;
    });
});