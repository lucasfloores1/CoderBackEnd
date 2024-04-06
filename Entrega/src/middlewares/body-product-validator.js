import { logger } from "../config/logger.js"
import { InvalidDataException } from "../utils/exception.js"

export const BodyProductValidator = (error, req, res, next) => {
    const { body } = req
        const { 
            code,
            title,
            description,
            price,
            stock,
            type,
            owner,
            isAdmin
         } = body
        if (
            !code ||
            !title ||
            !description ||
            !price ||
            !stock ||
            !isAdmin ||
            !type
        ) {
            logger.error('Invalid data')
            throw new InvalidDataException('Invalid data: All the fields are required')
        }
    logger.debug('Body data was succesfully validated');
    next();
}