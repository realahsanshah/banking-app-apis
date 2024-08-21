import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (token) {
            try {
                const decoded = this.jwtService.verify(token);

                let userData: any = await this.userRepository.findOne({
                    where: {
                        id: decoded?.id,
                        is_deleted: false,
                    },
                });

                userData = JSON.parse(JSON.stringify(userData));
                if (decoded?.isForgotPassword) {
                    userData.isForgotPassword = true;
                }
                request.user = userData;

                return true;
            } catch (error) {
                return false;
            }
        }

        // Handle missing or invalid token
        return false;
    }
}