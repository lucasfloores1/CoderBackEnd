import mongoose from 'mongoose';

export const URI = 'mongodb+srv://lucasfloores1:8TMgHT9GSg1nG1u1@cluster0.e1puumx.mongodb.net/ecommerce';

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database connected susscessfully 🚀');
  } catch (error) {
    console.error('Ocurrio un error al intenter conectarnos a la base de datos 😨');
  }
}