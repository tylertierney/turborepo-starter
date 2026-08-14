import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Which page to fetch.',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Size of returned pages.',
    example: 10,
    default: 10,
    maximum: 100,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({
    description:
      'Comma-separated columns to sort by. Prefix a column with "-" for descending order.',
    examples: {
      ascending: {
        value: 'createdAt',
      },
      descending: {
        value: '-createdAt',
      },
      multiple: {
        value: '-createdAt,email',
      },
    },
  })
  @IsOptional()
  @IsString()
  sort?: string
}
