import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const dbName = process.env.DB_NAME;

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_NAME || 'bank.sqlite',
    entities: [__dirname + '/**/*.entity.ts'],
    migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
});