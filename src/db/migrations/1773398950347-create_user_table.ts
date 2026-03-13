import { User } from "src/users/entities/user.entity";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1773398950347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns:[

                    {
                        name:'id',
                        type:'int',
                        isPrimary:true,
                        isGenerated:true,
                        generationStrategy:"increment"
                    },

                    {
                        name:'email',
                        type:'varchar',
                        isUnique:true,
                    },
                    {
                        name:'password',
                        type:'varchar'
                    },
                    {
                        name:'name',
                        type:'varchar'
                    },
                    {
                        name:'number',
                        type:'varchar'
                    },
                    {
                        name:'address',
                        type:'varchar'
                    },
                    {
                        name:'createdAt',
                        type:'timestamp',
                        default:'now()'
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
