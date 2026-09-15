import { Module } from '@nestjs/common'

import { VerificationModule } from '../verification/verification.module'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { AvatarController } from './avatar.controller'

@Module({
	imports: [VerificationModule],
	controllers: [AvatarController],
	providers: [AccountResolver, AccountService]
})
export class AccountModule {}
