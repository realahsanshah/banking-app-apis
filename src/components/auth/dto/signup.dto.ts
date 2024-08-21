import { ApiProperty } from "@nestjs/swagger";
import { EmailDTO } from "./email.dto";
import { IsEnum, IsNotEmpty, IsStrongPassword, Matches, MinLength } from "class-validator";
import { CNIC_REGEX } from "../../../common/regex/regex";
import { GenderEnum } from "../../../enum/gender/gender.enum";

export class SignupDTO extends EmailDTO {
    @ApiProperty()
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty()
    // 13 digit number
    @Matches(CNIC_REGEX, {
        message: 'Invalid CNIC number',
    })
    cnic: string;

    @ApiProperty()
    // enum GenderEnum
    @IsEnum(GenderEnum)
    gender: GenderEnum;

}