import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class AmountDTO {
    @ApiProperty()
    @IsPositive()
    amount: number;
}