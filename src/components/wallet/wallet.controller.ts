import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../../decorator/user.decorator';
import { AmountDTO } from './dto/amount.dto';
import { TransferDTO } from './dto/transfer.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('getWallet')
    async getWallet(@GetUser() user) {
        return this.walletService.getWallet(user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('depositAmount')
    depositAmount(@Body() amountDto: AmountDTO, @GetUser() user) {
        return this.walletService.depositAmount(amountDto, user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('withdrawAmount')
    withdrawAmount(@Body() amountDto: AmountDTO, @GetUser() user) {
        return this.walletService.withdrawAmount(amountDto, user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('transferAmount')
    transferAmount(@Body() transferDto: TransferDTO, @GetUser() user) {
        return this.walletService.transferAmount(transferDto, user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
    @ApiQuery({ name: 'offset', required: false, example: 0, type: Number })
    @Get('getTransactions')
    getTransactions(
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
        @GetUser() user) {
        return this.walletService.getTransactions(limit, offset, user);
    }
}
