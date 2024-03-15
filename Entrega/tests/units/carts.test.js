import { expect } from "chai"; 
import mongoose from "mongoose";
import config from "../../src/config/config.js";
import CartsManager from "../../src/controllers/carts.controller.js";

describe('Utils testing', function () {
    before( async function (){
        await mongoose.connect(`${config.mongodb_uri}-test`);
    });

    beforeEach( async function (){
        await mongoose.connection.collections.carts.drop();
    });

    after( async function (){
        await mongoose.connection.close();
    });
    it('', async function (){
        
    });

    it('', async function (){

    });

    it('', async function (){

    });

    it('', async function (){

    });

});