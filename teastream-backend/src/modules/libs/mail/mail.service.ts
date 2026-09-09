import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { VerificationTemplate } from './templates/verification.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendVerificationToken(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(VerificationTemplate({ domain, token }))

		await this.sendMail(email, 'account verification', html)
	}

	private async sendMail(
		email: string,
		subject: string,
		html: string
	): Promise<void> {
		await this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
