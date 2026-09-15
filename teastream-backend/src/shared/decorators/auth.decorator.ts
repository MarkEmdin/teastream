import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards/gql-auth.guard'
import { HttpAuthGuard } from '../guards/http-auth.guard'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}

export function HttpAuthorization() {
	return applyDecorators(UseGuards(HttpAuthGuard))
}
