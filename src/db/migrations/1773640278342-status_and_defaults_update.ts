import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class StatusAndDefaultsUpdate1773640278342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'accounts',
            'balance',
            new TableColumn({
                name: 'balance',
                type: 'decimal',
                precision: 12,
                scale: 2,
                default: 0
            }),
        );
        await queryRunner.changeColumn(
            'accounts',
            'status',
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "CLOSED", "PAUSED"],
                default: "'ACTIVE'",
            }),
        );
        await queryRunner.changeColumn(
            "cards",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "BLOCKED", "EXPIRED"],
                default: "'ACTIVE'",
            }),
        );

        await queryRunner.changeColumn(
            "fixed_deposites",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "MATURED", "CLOSED"],
                default: "'ACTIVE'",
            }),
        );

        await queryRunner.changeColumn(
            "transfers",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["PENDING", "SUCCESS", "FAILED"],
                default: "'PENDING'",
            }),
        );

        await queryRunner.changeColumn(
            'transactions',
            'status',
            new TableColumn({
                name: 'status',
                type: 'enum',
                enum: ['PENDING', 'SUCCESS', 'FAILED'],
                default: "'PENDING'"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "transactions",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["PENDING", "SUCCESS", "FAILED"],
            }),
        );

        await queryRunner.changeColumn(
            "transfers",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["PENDING", "SUCCESS", "FAILED"],
            }),
        );

        await queryRunner.changeColumn(
            "fixed_deposites",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "MATURED", "CLOSED"],
            }),
        );

        await queryRunner.changeColumn(
            "cards",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "BLOCKED", "EXPIRED"],
            }),
        );

        await queryRunner.changeColumn(
            "accounts",
            "status",
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["ACTIVE", "CLOSED", "PAUSED"],
            }),
        );

        await queryRunner.changeColumn(
            "accounts",
            "balance",
            new TableColumn({
                name: "balance",
                type: "decimal",
                precision: 12,
                scale: 2,
            })

        );
    }

}
