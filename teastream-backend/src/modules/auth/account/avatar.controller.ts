import {
	BadRequestException,
	Controller,
	Post,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'

import { HttpAuthorization } from '@/src/shared/decorators/auth.decorator'
import { avatarMulterOptions } from '@/src/shared/utils/avatar-storage.util'

import { AccountService } from './account.service'

@Controller('account')
export class AvatarController {
	public constructor(private readonly accountService: AccountService) {}

	@HttpAuthorization()
	@Post('avatar')
	@UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
	public async uploadAvatar(
		@Req() req: Request,
		@UploadedFile() file?: Express.Multer.File
	) {
		if (!file) {
			throw new BadRequestException('avatar file is required')
		}

		const { password, ...user } = await this.accountService.updateAvatar(
			req.user!.id,
			file.filename
		)
		void password

		return user
	}
}
