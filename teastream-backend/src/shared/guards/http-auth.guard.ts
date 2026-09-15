import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class HttpAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(' user is unauthorized')
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId
			}
		})

		if (!user || user.isDeactivated) {
			throw new UnauthorizedException(' user is unauthorized')
		}

		request.user = user

		return true
	}
}
