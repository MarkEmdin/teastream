import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import type { GqlContext } from '@/src/shared/types/context.types'

import { DeactivationService } from './deactivation.service'
import { ConfirmDeactivationInput } from './inputs/confirm-deactivation.input'

@Resolver('Deactivation')
export class DeactivationResolver {
	public constructor(
		private readonly deactivationService: DeactivationService
	) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'requestDeactivation' })
	public async requestDeactivation(@Authorized('id') id: string) {
		return this.deactivationService.requestDeactivation(id)
	}

	@Mutation(() => Boolean, { name: 'confirmDeactivation' })
	public async confirmDeactivation(
		@Context() { req }: GqlContext,
		@Args('data') input: ConfirmDeactivationInput
	) {
		return this.deactivationService.confirmDeactivation(req, input)
	}
}
