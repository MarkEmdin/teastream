import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

import type { User } from '@/prisma/generated'
import type { GqlContext } from '@/src/shared/types/context.types'

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User | null | undefined

		if (ctx.getType() === 'http') {
			user = ctx.switchToHttp().getRequest<Request>().user
		} else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext<GqlContext>().req.user
		}

		return data && user ? user[data] : user
	}
)
