import UserDTO from "../dto/user.dto.js";

export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getAll(criteria = {}) {
        const users = await this.dao.getAll(criteria);
        return users.map( user => new UserDTO(user) );
    }

    async getRaw() {
        const users = await this.dao.getAll();
        return users;
    }

    async getById(uid) {
        const user = await this.dao.getById(uid);
        return user;
    }

    async getByEmail(email) {
        const user = await this.dao.getByEmail(email);
        return user;
    }

    async create(data) {
        const user = await this.dao.create(data);
        return user;
    }

    async updateById(uid, data) {
        const user = await this.dao.updateById(uid, data);
        return user;
    }

    async updateByEmail(email, data) {
        const user = await this.dao.updateByEmail(email, data);
        return user;
    }

    async deleteById(uid) {
        return await this.dao.deleteById(uid);
    }
    
}