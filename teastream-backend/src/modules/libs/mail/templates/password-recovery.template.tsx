import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Preview,
	Row,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

import type { SessionMetadata } from '@/src/shared/types/sesion-metadata.types'

interface PasswordRecoveryTemplateProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata
}: PasswordRecoveryTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Reset your password</Preview>
			<Tailwind>
				<Body className='bg-gray-100 font-sans'>
					<Container className='mx-auto my-10 max-w-[480px] rounded-lg bg-white p-8'>
						<Heading className='mb-4 text-xl font-bold text-gray-900'>
							Reset your password
						</Heading>

						<Text className='text-sm text-gray-600'>
							We received a request to reset the password for your
							account on {domain}. Use the code below to continue.
						</Text>

						<Section className='my-6 text-center'>
							<Text className='inline-block rounded-md bg-gray-900 px-6 py-3 text-2xl font-bold tracking-[0.3em] text-white'>
								{token}
							</Text>
						</Section>

						<Text className='text-sm text-gray-600'>
							This code will expire shortly, so enter it soon.
						</Text>

						<Hr className='my-6 border-gray-200' />

						<Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400'>
							Request details
						</Text>
						<Section className='rounded-md bg-gray-50 p-4'>
							<Row>
								<Text className='m-0 text-xs text-gray-500'>
									Device: {metadata.device.browser} on{' '}
									{metadata.device.os} ({metadata.device.type}
									)
								</Text>
							</Row>
							<Row>
								<Text className='m-0 text-xs text-gray-500'>
									Location: {metadata.location.city},{' '}
									{metadata.location.country}
								</Text>
							</Row>
							<Row>
								<Text className='m-0 text-xs text-gray-500'>
									IP address: {metadata.ip}
								</Text>
							</Row>
						</Section>

						<Hr className='my-6 border-gray-200' />

						<Text className='text-xs text-gray-400'>
							If you didn&apos;t request a password reset, you can
							safely ignore this email — your password won&apos;t
							be changed.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
