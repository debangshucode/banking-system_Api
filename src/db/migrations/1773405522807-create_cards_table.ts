import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCardsTable1773405522807 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cards',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'cardNumber',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'cardType',
                        type: 'enum',
                        enum: ['DEBIT', 'CREDIT']
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['ACTIVE', 'BLOCKED', 'EXPIRED']
                    },
                    {
                        name: 'cvv',
                        type: 'varchar',
                        length: '4',
                    },
                    {
                        name: 'pin',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'expiryDate',
                        type: 'timestamp'
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'accountId',
                        type: 'int'
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['accountId'],
                        referencedTableName: 'accounts',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cards')
    }

}
