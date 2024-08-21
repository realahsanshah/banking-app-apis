import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'wallet_with_user',
  expression: `
    SELECT
        w.id AS wallet_id,
        w.account_number,
        w.iban,
        w.balance,
        w.is_active,
        w.is_freezed,
        u.id AS user_id,
        u.email,
        u.full_name,
        u.cnic,
        u.gender
    FROM
        wallets w
    INNER JOIN
        users u ON w."userId" = u.id;
    `,
})
export class WalletWithUserView {
  @ViewColumn()
  wallet_id: string;

  @ViewColumn()
  account_number: string;

  @ViewColumn()
  iban: string;

  @ViewColumn()
  balance: number;

  @ViewColumn()
  is_active: boolean;

  @ViewColumn()
  is_freezed: boolean;

  @ViewColumn()
  email: string;

  @ViewColumn()
  user_id: string;

  @ViewColumn()
  full_name: string;

  @ViewColumn()
  cnic: string;

  @ViewColumn()
  gender: string;

  fromJSON(data: any): WalletWithUserView {
    this.wallet_id = data.wallet_id;
    this.account_number = data.account_number;
    this.iban = data.iban;
    this.balance = data.balance;
    this.is_active = data.is_active;
    this.is_freezed = data.is_freezed;
    this.user_id = data.user_id;
    this.full_name = data.full_name;
    this.cnic = data.cnic;
    this.email = data.email;
    this.gender = data.gender;

    return this;
  }
}
