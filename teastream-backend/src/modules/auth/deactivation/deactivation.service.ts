import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { destroySession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'

import { ConfirmDeactivationInput } from './inputs/confirm-deactivation.input'

@Injectable()
export class DeactivationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}

	public async requestDeactivation(userId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!user) {
			throw new NotFoundException('cannot find user')
		}

		const deactivationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT
		)

		await this.mailService.sendDeactivationToken(
			user.email,
			deactivationToken.token
		)

		return true
	}

	public async confirmDeactivation(
		req: Request,
		input: ConfirmDeactivationInput
	) {
		const { token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		if (!existingToken) {
			throw new NotFoundException('cannot find token')
		}

		const hasExpired = new Date(existingToken.expireIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('token has expired')
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		await this.destroyUserSessions(existingToken.userId)

		return destroySession(req, this.configService)
	}

	private async destroyUserSessions(userId: string) {
		const keys = await this.redisService.keys('sessions:*')

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (!sessionData) {
				continue
			}

			const session = JSON.parse(sessionData) as { userId?: string }

			if (session.userId === userId) {
				await this.redisService.del(key)
			}
		}
	}
}
