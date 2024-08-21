import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/entity/wallet/wallet.entity';
import { generateStringId } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { AmountDTO } from './dto/amount.dto'
import { Transaction } from 'src/entity/transaction/transaction.entity';
import { UtilsService } from '../utils/utils.service';
import { TransactionStatusEnum } from 'src/enum/transaction-status/transaction-status.enum';
import { TransactionTypeEnum } from 'src/enum/transaction-type/transaction-type.enum';

@Injectable()
export class WalletService {
    constructor(

        @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
        private utilsService: UtilsService,
    ) { }

    createWallet() {
        const wallet = new Wallet();

        // generate random account number
        wallet.account_number = generateStringId();
        wallet.iban = `PKBAN${wallet?.account_number}${new Date()?.getFullYear()}`;

        return wallet;
    }

    async getWallet(user) {
        const wallet = await this.walletRepository.findOne({
            where: {
                user: {
                    id: user?.id,
                },
            },
        });

        if (!wallet) {
            const wallet = this.createWallet();
            wallet.user = user;
            await this.walletRepository.save(wallet);
        }

        return wallet;
    }

    async depositAmount(amountDto: AmountDTO, user) {
        const wallet = await this.walletRepository.findOne({
            where: {
                user: {
                    id: user?.id,
                },
            },
        });

        wallet.balance += amountDto?.amount;

        const transaction = new Transaction();

        transaction.fromUser = null;
        transaction.toUser = user?.id;
        transaction.transactionStatus = TransactionStatusEnum.COMPLETED;
        transaction.transactionType = TransactionTypeEnum.DEPOSIT;
        transaction.amount = amountDto?.amount;

        await this.utilsService.commitTransactions([
            wallet,
            transaction
        ]);

        return {
            message: "Deposit successfully",
            wallet,
            transaction,
        };
    }

    async withdrawAmount(amountDto: AmountDTO, user) {
        const wallet = await this.walletRepository.findOne({
            where: {
                user: {
                    id: user?.id,
                },
            },
        });

        if (wallet?.balance - amountDto?.amount < 0) {
            throw new Error("Insufficient Balance");
        }

        wallet.balance -= amountDto?.amount;

        const transaction = new Transaction();

        transaction.fromUser = user?.id;
        transaction.toUser = null;
        transaction.transactionStatus = TransactionStatusEnum.COMPLETED;
        transaction.transactionType = TransactionTypeEnum.WITHDRAW;
        transaction.amount = amountDto?.amount;

        await this.utilsService.commitTransactions([
            wallet,
            transaction
        ]);

        return {
            message: "Deposit successfully",
            wallet,
            transaction,
        };
    }
}
