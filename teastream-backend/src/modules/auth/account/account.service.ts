import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from '@node-rs/argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { VerificationService } from '../verification/verification.service'

import { CreateUserInput } from './inputs/create-user.input'

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
}
