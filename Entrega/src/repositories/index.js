import CartRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";

import TicketDaoMongoDB from "../dao/ticket.dao.js";
import CartDaoMongoDB from "../dao/cart.dao.js";
import ProductDaoMongoDB from "../dao/product.dao.js";
import UserDaoMongoDB from "../dao/user.dao.js";


export const ticketsRepository = new TicketRepository(TicketDaoMongoDB);
export const cartsRepository = new CartRepository(CartDaoMongoDB);
export const productsRepository = new ProductRepository(ProductDaoMongoDB);
export const usersRepository = new UserRepository(UserDaoMongoDB);