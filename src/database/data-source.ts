import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const dbType = process.env.DB_TYPE;
const dbName = process.env.DB_NAME;

export const appDataSourse = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || (() => { throw new Error('DB_HOST is required'); })(),
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME || (() => { throw new Error('DB_USERNAME is required'); })(),
    password: process.env.DB_PASSWORD || (() => { throw new Error('DB_PASSWORD is required'); })(),
    database: dbName,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [__dirname + '/**/*.entity.ts'],
    migrations: [__dirname + '/db/migrations/*.ts'],
});