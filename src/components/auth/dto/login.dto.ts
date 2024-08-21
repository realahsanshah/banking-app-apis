import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { EmailDTO } from "./email.dto";

export class LoginDTO extends EmailDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}