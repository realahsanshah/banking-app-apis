import { ApiProperty } from "@nestjs/swagger";
import { IsStrongPassword } from "class-validator";

export class PasswordDTO {
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
}