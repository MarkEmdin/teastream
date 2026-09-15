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

interface DeactivationTemplateProps {
	domain: string
	token: string
}

export function DeactivationTemplate({
	domain,
	token
}: DeactivationTemplateProps) {
	const deactivationLink = `${domain}/account/deactivate?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Confirm account deactivation</Preview>
			<Tailwind>
				<Body className='bg-gray-100 font-sans'>
					<Container className='mx-auto my-10 max-w-[480px] rounded-lg bg-white p-8'>
						<Heading className='mb-4 text-xl font-bold text-gray-900'>
							Deactivate your account
						</Heading>

						<Text className='text-sm text-gray-600'>
							We received a request to deactivate your account on{' '}
							{domain}. Click the button below to confirm.
						</Text>

						<Section className='my-6 text-center'>
							<Button
								href={deactivationLink}
								className='rounded-md bg-black px-6 py-3 text-sm font-semibold text-white'
							>
								Deactivate account
							</Button>
						</Section>

						<Text className='text-sm text-gray-600'>
							If the button doesn&apos;t work, copy and paste this
							link into your browser:
						</Text>
						<Text className='break-all text-sm text-blue-600'>
							{deactivationLink}
						</Text>

						<Hr className='my-6 border-gray-200' />

						<Text className='text-xs text-gray-400'>
							If you didn&apos;t request this, you can safely
							ignore this email — your account will stay active.
							Signing in again also reactivates a deactivated
							account.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
