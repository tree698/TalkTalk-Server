import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export default async function teardown() {
  return new Promise(async (resolve) => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'talktalk-test',
      password: process.env['DB_PASSWORD'],
    });

    try {
      await connection.execute('DROP TABLE tweets, users, works');
    } catch (err) {
      console.log('Something went wrong when cleaning the DB', err);
    } finally {
      connection.end();
    }

    resolve();
  });
}
