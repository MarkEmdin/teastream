import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	public token: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string
}
