import 'express-session'

import type { SessionMetadata } from './sesion-metadata.types'

declare module 'express-session' {
	interface SessionData {
		userId?: string
		createdAt: Date
		metadata: SessionMetadata
	}
}
