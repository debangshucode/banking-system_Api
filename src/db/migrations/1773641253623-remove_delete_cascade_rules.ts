import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class RemoveDeleteCascadeRules1773641253623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const accountsTable = await queryRunner.getTable("accounts");
        const transfersTable = await queryRunner.getTable("transfers");
        const transactionsTable = await queryRunner.getTable("transactions");
        const cardsTable = await queryRunner.getTable("cards");
        const fixedDepositesTable = await queryRunner.getTable("fixed_deposites");

        const accountUserFk = accountsTable?.foreignKeys.find(fk => fk.columnNames.includes("userId"));
        const transferFromFk = transfersTable?.foreignKeys.find(fk => fk.columnNames.includes("fromAccountId"));
        const transferToFk = transfersTable?.foreignKeys.find(fk => fk.columnNames.includes("toAccountId"));
        const transactionAccountFk = transactionsTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));
        const cardAccountFk = cardsTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));
        const fdAccountFk = fixedDepositesTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));

        if (accountUserFk) await queryRunner.dropForeignKey("accounts", accountUserFk);
        if (transferFromFk) await queryRunner.dropForeignKey("transfers", transferFromFk);
        if (transferToFk) await queryRunner.dropForeignKey("transfers", transferToFk);
        if (transactionAccountFk) await queryRunner.dropForeignKey("transactions", transactionAccountFk);
        if (cardAccountFk) await queryRunner.dropForeignKey("cards", cardAccountFk);
        if (fdAccountFk) await queryRunner.dropForeignKey("fixed_deposites", fdAccountFk);


        await queryRunner.createForeignKey(
            'accounts',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
            }),
        );
        await queryRunner.createForeignKey(
            "transfers",
            new TableForeignKey({
                columnNames: ["fromAccountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
            }),
        );

        await queryRunner.createForeignKey(
            "transfers",
            new TableForeignKey({
                columnNames: ["toAccountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
            }),
        );

        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
            }),
        );

        await queryRunner.createForeignKey(
            "cards",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
            }),
        );

        await queryRunner.createForeignKey(
            "fixed_deposites",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const accountsTable = await queryRunner.getTable('accounts');
        const transfersTable = await queryRunner.getTable("transfers");
        const transactionsTable = await queryRunner.getTable("transactions");
        const cardsTable = await queryRunner.getTable("cards");
        const fixedDepositesTable = await queryRunner.getTable("fixed_deposites");

        const accountUserFk = accountsTable?.foreignKeys.find(fk => fk.columnNames.includes('userId'));
        const transferFromFk = transfersTable?.foreignKeys.find(fk => fk.columnNames.includes("fromAccountId"));
        const transferToFk = transfersTable?.foreignKeys.find(fk => fk.columnNames.includes("toAccountId"));
        const transactionAccountFk = transactionsTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));
        const cardAccountFk = cardsTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));
        const fdAccountFk = fixedDepositesTable?.foreignKeys.find(fk => fk.columnNames.includes("accountId"));

        if (accountUserFk) await queryRunner.dropForeignKey('accounts', accountUserFk);
        if (transferFromFk) await queryRunner.dropForeignKey("transfers", transferFromFk);
        if (transferToFk) await queryRunner.dropForeignKey("transfers", transferToFk);
        if (transactionAccountFk) await queryRunner.dropForeignKey("transactions", transactionAccountFk);
        if (cardAccountFk) await queryRunner.dropForeignKey("cards", cardAccountFk);
        if (fdAccountFk) await queryRunner.dropForeignKey("fixed_deposites", fdAccountFk);

        await queryRunner.createForeignKey(
            "accounts",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "transfers",
            new TableForeignKey({
                columnNames: ["fromAccountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "transfers",
            new TableForeignKey({
                columnNames: ["toAccountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "cards",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "fixed_deposites",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedTableName: "accounts",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
        );
    }

}
