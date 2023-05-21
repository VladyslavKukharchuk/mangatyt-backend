import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    const accessToken = request.headers.authorization.split(' ')[1];
    return accessToken ? accessToken : null;
  },
);
