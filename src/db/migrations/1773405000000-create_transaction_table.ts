import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactionTable1773405000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'transactionType',
                        type: 'enum',
                        enum: ['DEPOSIT', 'WITHDRAWAL']
                    },
                    {
                        name: 'amount',
                        type: 'int'
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['PENDING', 'SUCCESS', 'FAILED']
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'accountId',
                        type: 'int'
                    },
                    {
                        name: 'transferId',
                        type: 'int',
                        isNullable: true,
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['accountId'],
                        referencedTableName: 'accounts',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['transferId'],
                        referencedTableName: 'transfers',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions')
    }

}
