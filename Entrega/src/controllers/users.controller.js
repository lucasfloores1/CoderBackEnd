import UsersService from "../services/users.service.js";

export default class UserController {

    static async uploadFile(uid, file) {
        const user = await UsersService.getById(uid);
        user.documents.push({ name : file.originalname , reference : file.path });
        await user.save();
    }

    static async getByEmail(email) {
        const user = await UsersService.getByEmail(email);
        return user;
    }

    static async getById(uid) {
        const user = await UsersService.getById(uid);
        return user;
    }

    static async updateByEmail(email, data) {
        const user = await UsersService.updateByEmail(email, data);
        return user;
    }

    static async updateById(uid, data) {
        const user = await UsersService.updateById(uid, data);
        return user;
    }
    
    static async getAll() {
        const users = await UsersService.getAll();
        return users;
    }

    static async deleteById(uid) {
        return await UsersService.deleteById(uid);
    }

    static async create(data) {
        const user = await UsersService.create(data);
        return user;
    }
}