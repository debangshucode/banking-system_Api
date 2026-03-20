import { CanActivate,ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserRole } from "src/users/entities/user.entity";

export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if(!request.currentUser) {
            throw new UnauthorizedException('User not authenticated')
        }
        if (request.currentUser.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You dont have access to this resouces')
        }

        return true;
    }
}  
