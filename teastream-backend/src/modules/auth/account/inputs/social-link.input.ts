import { Field, InputType, Int } from '@nestjs/graphql'
import {
	IsInt,
	IsNotEmpty,
	IsString,
	IsUrl,
	MaxLength,
	Min
} from 'class-validator'

@InputType()
export class SocialLinkInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	public title: string

	@Field()
	@IsString()
	@IsUrl()
	public url: string
}

@InputType()
export class ReorderSocialLinkInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public id: string

	@Field(() => Int)
	@IsInt()
	@Min(0)
	public position: number
}
