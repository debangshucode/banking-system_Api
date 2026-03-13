import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccountTable1773400252475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'accounts',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'accountNumber',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'accountType',
                        type: 'enum',
                        enum: ["SAVINGS", "CURRENT", "BUSINESS"]
                    },
                    {
                        name: 'balance',
                        type: 'int',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['ACTIVE', 'CLOSED', 'PAUSED']
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: "userId",
                        type: "int"
                    }
                ],
                foreignKeys:[
                    {
                        columnNames:['userId'],
                        referencedTableName:'users',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("accounts");
    }

}
