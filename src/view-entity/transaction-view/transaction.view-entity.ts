import { GenderEnum } from "../../enum/gender/gender.enum";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    name: 'transaction_view',
    expression: `
    SELECT
    t.id AS transaction_id,
    t.amount,
    t."transactionStatus",
    t."transactionType",
    t."fromUserId",
    t.created_at,
    f.email AS from_user_email,
    f.full_name AS from_user_full_name,
    f.cnic AS from_user_cnic,
    f.gender AS from_user_gender,
    t."toUserId",
    tu.email AS to_user_email,
    tu.full_name AS to_user_full_name,
    tu.cnic AS to_user_cnic,
    tu.gender AS to_user_gender
FROM
    transactions t
LEFT JOIN
    users f ON t."fromUserId" = f.id
INNER JOIN
    users tu ON t."toUserId" = tu.id;
    `
})
export class TransactionView {
    @ViewColumn()
    transaction_id: string;

    @ViewColumn()
    amount: number;

    @ViewColumn()
    transactionStatus: string;

    @ViewColumn()
    transactionType: string;

    @ViewColumn()
    fromUserId: string;

    @ViewColumn()
    from_user_email: string;

    @ViewColumn()
    from_user_full_name: string;

    @ViewColumn()
    from_user_cnic: string;

    @ViewColumn()
    from_user_gender: GenderEnum;

    @ViewColumn()
    toUserId: string;

    @ViewColumn()
    to_user_email: string;

    @ViewColumn()
    to_user_full_name: string;

    @ViewColumn()
    to_user_cnic: string;

    @ViewColumn()
    to_user_gender: GenderEnum;

    @ViewColumn()
    created_at: Date;
}