import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users.service";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User | null;
        }
    }
}
@Injectable()

export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}

        if (userId) {
            try {
                const user = await this.usersService.findOne(userId)
                req.currentUser = user
            }
            catch (err) {
                if(err instanceof NotFoundException)
                {
                    req.currentUser = null;
                    req.session = null;
                }
                else{
                    throw err;
                }
            }
        }
        next();
    }
}