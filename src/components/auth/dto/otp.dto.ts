import { ApiProperty } from "@nestjs/swagger";
import { EmailDTO } from "./email.dto";
import { IsNumberString, MaxLength, MinLength } from "class-validator";

export class OtpDTO extends EmailDTO {
    @ApiProperty()
    // 6 digit number
    @MinLength(6)
    @MaxLength(6)
    @IsNumberString()
    otp: string;

}