import { usersRepository } from "../repositories/index.js";

export default class UsersService {
    static getAll (filter = {}) {
        return usersRepository.getAll(filter);
    }

    static create(data) {
        return usersRepository.create(data);
    }

    static  getById(uid) {
        return usersRepository.getById(uid);
    }

    static async getByEmail(email) {
        return usersRepository.getByEmail(email);
    }

    static updateById(uid, data) {
        return usersRepository.updateById(uid, data);
    }

    static updateByEmail(email, data) {
        return usersRepository.updateByEmail(email, data);
    }

    static deleteById(uid) {
        return usersRepository.deleteById(uid);
    }

    static uploadFile(uid, typeFile, file) {
        return usersRepository.uploadFile(uid, typeFile, file)
    }

    static connect( email ) {
        return usersRepository.connect( email );
    }
}