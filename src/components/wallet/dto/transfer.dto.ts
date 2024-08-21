import { ApiProperty } from '@nestjs/swagger';
import { AmountDTO } from './amount.dto';
import { IsNotEmpty } from 'class-validator';

export class TransferDTO extends AmountDTO {
  @ApiProperty()
  @IsNotEmpty()
  iban: string;
}
