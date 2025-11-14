import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('SEQUELIZE_URL:', process.env.SEQUELIZE_URL);

import {Sequelize, DataType, Model} from "sequelize"




const sequelize = new Sequelize(process.env.SEQUELIZE_URL, {
  dialect: 'postgres',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('No se pudo conectar:', error);
  }
}

testConnection();

export default sequelize;