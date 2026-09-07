import type { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import { join } from 'path'

import { isDev } from '@/src/shared/utils/is-dev.util'

export function getGraphQLConfig(
	configService: ConfigService
): ApolloDriverConfig {
	return {
		playground: isDev(configService) && {
			settings: { 'request.credentials': 'include' }
		},
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/shema.gql'),
		sortSchema: true,
		context: ({ req, res }: { req: Request; res: Response }) => ({
			req,
			res
		})
	}
}
