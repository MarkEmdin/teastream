import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from '@node-rs/argon2'
import { join } from 'path'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { AVATAR_UPLOAD_DIR } from '@/src/shared/utils/avatar-storage.util'

import { VerificationService } from '../verification/verification.service'
import { unlink } from 'fs/promises'

import { CreateUserInput } from './inputs/create-user.input'
import { UpdateProfileInput } from './inputs/update-profile.input'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				socialLinks: {
					orderBy: {
						position: 'asc'
					}
				}
			}
		})
		return user
	}

	public async findAll() {
		return this.prismaService.user.findMany()
	}

	public async create(input: CreateUserInput) {
		const { username, password, email } = input

		const isUsernameExist = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUsernameExist) {
			throw new ConflictException('this name is existed already')
		}

		const isEmailExist = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})
		if (isEmailExist) {
			throw new ConflictException('this email is existed already')
		}

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username
			}
		})
		await this.verificationService.sendVerificationToken(user)

		return true
	}

	public async updateProfile(userId: string, input: UpdateProfileInput) {
		const { username, email, displayName, bio } = input

		if (username) {
			const isUsernameTaken = await this.prismaService.user.findFirst({
				where: {
					username,
					NOT: {
						id: userId
					}
				}
			})

			if (isUsernameTaken) {
				throw new ConflictException('this name is existed already')
			}
		}

		let isEmailChanged = false

		if (email) {
			const isEmailTaken = await this.prismaService.user.findFirst({
				where: {
					email,
					NOT: {
						id: userId
					}
				}
			})

			if (isEmailTaken) {
				throw new ConflictException('this email is existed already')
			}

			const currentUser = await this.prismaService.user.findUniqueOrThrow(
				{
					where: {
						id: userId
					}
				}
			)

			isEmailChanged = currentUser.email !== email
		}

		const user = await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				...(username && { username }),
				...(email && { email }),
				...(isEmailChanged && { isEmailVerified: false }),
				...(displayName && { displayName }),
				...(bio !== undefined && { bio })
			}
		})

		if (isEmailChanged) {
			await this.verificationService.sendVerificationToken(user)
		}

		return user
	}

	public async updateAvatar(userId: string, filename: string) {
		const currentUser = await this.prismaService.user.findUniqueOrThrow({
			where: {
				id: userId
			}
		})

		const avatar = `/uploads/avatars/${filename}`

		const user = await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				avatar
			}
		})

		if (
			currentUser.avatar &&
			currentUser.avatar.startsWith('/uploads/avatars/')
		) {
			await unlink(
				join(AVATAR_UPLOAD_DIR, currentUser.avatar.split('/').pop()!)
			).catch(() => undefined)
		}

		return user
	}
}
