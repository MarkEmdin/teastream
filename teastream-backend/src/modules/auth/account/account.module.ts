import { Module } from '@nestjs/common'

import { VerificationModule } from '../verification/verification.module'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { AvatarController } from './avatar.controller'
import { SocialLinkResolver } from './social-link.resolver'
import { SocialLinkService } from './social-link.service'

@Module({
	imports: [VerificationModule],
	controllers: [AvatarController],
	providers: [
		AccountResolver,
		AccountService,
		SocialLinkResolver,
		SocialLinkService
	]
})
export class AccountModule {}
