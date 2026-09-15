import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import type { SessionMetadata } from '@/src/shared/types/sesion-metadata.types'

import { DeactivationTemplate } from './templates/deactivation.template'
import { PasswordRecoveryTemplate } from './templates/password-recovery.template'
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

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata })
		)

		await this.sendMail(email, 'password recovery', html)
	}

	public async sendDeactivationToken(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(DeactivationTemplate({ domain, token }))

		await this.sendMail(email, 'account deactivation', html)
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
