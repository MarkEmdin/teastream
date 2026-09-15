import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/src/shared/types/context.types'

import { UserModel } from '../account/models/user.model'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
	public constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Mutation(() => Boolean, { name: 'resetPassword' })
	public async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data') input: ResetPasswordInput,
		@UserAgent() userAgent: string
	) {
		return this.passwordRecoveryService.resetPassword(req, input, userAgent)
	}

	@Mutation(() => UserModel, { name: 'newPassword' })
	public async newPassword(
		@Context() { req }: GqlContext,
		@Args('data') input: NewPasswordInput,
		@UserAgent() userAgent: string
	) {
		return this.passwordRecoveryService.newPassword(req, input, userAgent)
	}
}
