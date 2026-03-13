import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransferTable1773404352091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:'transfers',
                columns:[
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name:'amount',
                        type:'int'
                    },
                    {
                        name:'status',
                        type:'enum',
                        enum:['PENDING','SUCCESS','FAILED']
                    },
                    {
                        name:'createdAt',
                        type:'timestamp',
                        default:'now()'
                    },
                    {
                        name:'fromAccountId',
                        type:'int'
                    },
                    {
                        name:'toAccountId',
                        type:'int'
                    }
                ],
                foreignKeys:[
                    {
                        columnNames:['fromAccountId'],
                        referencedTableName:'accounts',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    },
                    {
                        columnNames:['toAccountId'],
                        referencedTableName:'accounts',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transfers');
    }

}
