import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";


export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requset = context.switchToHttp().getRequest();
        if (!requset.session.userId) {
            throw new UnauthorizedException('Please Sign in first');
        }

        return true;
    }
}