import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '@api/user/user.model';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
