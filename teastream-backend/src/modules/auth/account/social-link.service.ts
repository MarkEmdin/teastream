import { ForbiddenException, Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import {
	ReorderSocialLinkInput,
	SocialLinkInput
} from './inputs/social-link.input'

@Injectable()
export class SocialLinkService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll(userId: string) {
		return this.prismaService.socialLink.findMany({
			where: { userId },
			orderBy: { position: 'asc' }
		})
	}

	public async create(userId: string, input: SocialLinkInput) {
		const position = await this.prismaService.socialLink.count({
			where: { userId }
		})

		await this.prismaService.socialLink.create({
			data: {
				...input,
				userId,
				position
			}
		})

		return true
	}

	public async update(userId: string, id: string, input: SocialLinkInput) {
		const { count } = await this.prismaService.socialLink.updateMany({
			where: { id, userId },
			data: input
		})

		if (count === 0) {
			throw new ForbiddenException('social link not found')
		}

		return true
	}

	public async remove(userId: string, id: string) {
		const { count } = await this.prismaService.socialLink.deleteMany({
			where: { id, userId }
		})

		if (count === 0) {
			throw new ForbiddenException('social link not found')
		}

		return true
	}

	public async reorder(userId: string, input: ReorderSocialLinkInput[]) {
		await this.prismaService.$transaction(
			input.map(({ id, position }) =>
				this.prismaService.socialLink.updateMany({
					where: { id, userId },
					data: { position }
				})
			)
		)

		return true
	}
}
