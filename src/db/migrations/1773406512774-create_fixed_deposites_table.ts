import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFixedDepositesTable1773406512774 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'fixed_deposites',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name:'principalAmount',
                        type:'int'
                    },
                    {
                        name:'interestRate',
                        type:'decimal',
                        precision:5,
                        scale:2
                    },
                    {
                        name:'tenure',
                        type:'int'
                    },
                    {
                        name:'status',
                        type:'enum',
                        enum:['ACTIVE','MATURED','CLOSED']
                    },
                    {
                        name:'maturityDate',
                        type:'timestamp',
                    },
                    {
                        name:'createdAt',
                        type:'timestamp',
                        default:'now()'
                    },
                    {
                        name:'accountId',
                        type:'int'
                    }
                ],
                foreignKeys: [
                    {
                        columnNames:['accountId'],
                        referencedTableName:'accounts',
                        referencedColumnNames:['id'],
                        onDelete:'CASCADE'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('fixed_Deposites')
    }

}
