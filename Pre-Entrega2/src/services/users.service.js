import UserDao from '../dao/user.dao.js'

export default class UsersService {
    static getAll (filter = {}) {
        return UserDao.getAll(filter);
    }

    static create(data) {
        return UserDao.create(data);
    }

    static async getById(uid) {
        const result = await UserDao.getAll({ _id : uid });
        return result[0];
    }

    static async getByEmail(email) {
        const result = await UserDao.getAll({ email : email });
        return result[0];
    }

    static updateById(uid, data) {
        return UserDao.updateById(uid, data);
    }

    static updateByEmail(email, data) {
        return UserDao.updateByEmail(email, data);
    }

    static deleteById(uid) {
        return UserDao.deleteById(uid);
    }
}