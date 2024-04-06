import CartDTO from "./cart.dto.js";

export default class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.fullname = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = new CartDTO(user.cart);
        this.documents = user.documents
    }
}

export class ReducedUserDTO {
    constructor(user) {
        this.fullname = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
    }
}