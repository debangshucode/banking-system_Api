import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserRole1773812812583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users',
            new TableColumn({
                name:'role',
                type:'enum',
                enum:['ADMIN','USER'],
                default:"'USER'"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users','role')
    }

}
