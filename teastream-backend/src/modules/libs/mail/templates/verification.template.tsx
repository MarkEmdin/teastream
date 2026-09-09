import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface VerificationTemplateProps {
	domain: string
	token: string
}

export function VerificationTemplate({
	domain,
	token
}: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Verify your account</Preview>
			<Tailwind>
				<Body className='bg-gray-100 font-sans'>
					<Container className='mx-auto my-10 max-w-[480px] rounded-lg bg-white p-8'>
						<Heading className='mb-4 text-xl font-bold text-gray-900'>
							Verify your email
						</Heading>

						<Text className='text-sm text-gray-600'>
							Thanks for signing up! Click the button below to
							verify your account.
						</Text>

						<Section className='my-6 text-center'>
							<Button
								href={verificationLink}
								className='rounded-md bg-black px-6 py-3 text-sm font-semibold text-white'
							>
								Verify account
							</Button>
						</Section>

						<Text className='text-sm text-gray-600'>
							If the button doesn&apos;t work, copy and paste this
							link into your browser:
						</Text>
						<Text className='break-all text-sm text-blue-600'>
							{verificationLink}
						</Text>

						<Hr className='my-6 border-gray-200' />

						<Text className='text-xs text-gray-400'>
							If you didn&apos;t create an account, you can safely
							ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
