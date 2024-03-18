import UserDTO from "../dto/user.dto.js";

export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getAll(criteria = {}) {
        const users = await this.dao.getAll(criteria);
        return users.map( user => new UserDTO(user) );
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

    async uploadFile(uid, file) {
        const user = await this.dao.getById(uid);
        user.documents.push({ name : file.originalname , reference : file.path });
        await user.save();
        const updatedUser = await this.dao.getById(uid);
        return updatedUser;
    }

    async connect( email ) {
        const data = {
            last_connection : Date.now()
        }
        await this.dao.updateByEmail( email, data )
        const user = await this.dao.getByEmail(email);
        return user;
    }
    
}