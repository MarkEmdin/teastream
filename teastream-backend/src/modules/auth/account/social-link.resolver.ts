import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import {
	ReorderSocialLinkInput,
	SocialLinkInput
} from './inputs/social-link.input'
import { SocialLinkModel } from './models/social-link.model'
import { SocialLinkService } from './social-link.service'

@Resolver('SocialLink')
export class SocialLinkResolver {
	public constructor(private readonly socialLinkService: SocialLinkService) {}

	@Authorization()
	@Query(() => [SocialLinkModel], { name: 'findSocialLinks' })
	public async findAll(@Authorized('id') userId: string) {
		return this.socialLinkService.findAll(userId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createSocialLink' })
	public async create(
		@Authorized('id') userId: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.socialLinkService.create(userId, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	public async update(
		@Authorized('id') userId: string,
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.socialLinkService.update(userId, id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	public async remove(
		@Authorized('id') userId: string,
		@Args('id') id: string
	) {
		return this.socialLinkService.remove(userId, id)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'reorderSocialLinks' })
	public async reorder(
		@Authorized('id') userId: string,
		@Args('data', { type: () => [ReorderSocialLinkInput] })
		input: ReorderSocialLinkInput[]
	) {
		return this.socialLinkService.reorder(userId, input)
	}
}
