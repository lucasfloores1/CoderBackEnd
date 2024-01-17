import userModel from "./models/user.model.js"

export default class UserDaoMongoDB {
    static getAll(criteria = {}) {
        return userModel.find(criteria);
    }

    static create(data) {
        return userModel.create(data);
    }

    static updateById(uid, data) {
        return userModel.updateOne({ _id : uid }, { $set : data });
    }

    static updateByEmail(email, data) {
        return userModel.updateOne({ email : email }, { $set : data })
    }

    static deleteById(uid) {
        return userModel.deleteOne({ _id: uid });
    }
}