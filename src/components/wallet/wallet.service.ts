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
import { TransferDTO } from './dto/transfer.dto';
import { User } from 'src/entity/user/user.entity';
import { WalletWithUserView } from 'src/view-entity/wallet-with-user/wallet-with-user.view-entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
        @InjectRepository(WalletWithUserView) private walletWithUserViewRepository: Repository<WalletWithUserView>,
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

    async transferAmount(transferDto: TransferDTO, user) {
        const [fromWallet, toWalletView, toWallet] = await Promise.all([
            this.getWallet(user),
            this.walletWithUserViewRepository.findOne({
                where: {
                    iban: transferDto?.iban,
                },
            }),
            this.walletRepository.findOne({
                where: {
                    iban: transferDto?.iban,
                },
            })
        ]);

        if (!toWallet) {
            throw new Error("Invalid Receiver IBAN");
        }

        if (fromWallet?.balance - transferDto?.amount < 0) {
            throw new Error("Insufficient Balance");
        }

        fromWallet.balance -= transferDto?.amount;
        toWallet.balance += transferDto?.amount;

        const transaction = new Transaction()

        const userData = await this.userRepository.findOne({
            where: {
                id: toWalletView?.user_id,
            }
        });

        transaction.fromUser = user;
        transaction.toUser = userData;
        transaction.amount = transferDto?.amount;
        transaction.transactionStatus = TransactionStatusEnum.COMPLETED;
        transaction.transactionType = TransactionTypeEnum.TRANSFER;

        await this.utilsService.commitTransactions([
            fromWallet,
            toWallet,
            transaction,
        ]);

        return {
            message: "Transfer successfully",
            fromWallet,
            toWallet,
            transaction
        }
    }
}
