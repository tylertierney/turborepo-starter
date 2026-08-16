import { FindManyOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { PaginationQueryDto } from './pagination-query.dto.js'
import { PaginatedResult } from '@repo/models'
import { BadRequestException } from '@nestjs/common'

interface PaginateOptions<T extends ObjectLiteral> extends FindManyOptions<T> {
  sortable?: readonly (keyof T)[]
}

// import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
// import { BadRequestException } from '@nestjs/common'
// import { PaginationQueryDto } from './pagination-query.dto.js'
// import { PaginatedResult } from '@repo/models'

interface PaginateOptions<T extends ObjectLiteral> {
  sortable?: readonly (keyof T)[]
}

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationQueryDto,
  paginateOptions: PaginateOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const page = options.page && options.page > 0 ? options.page : 1

  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : 10

  const skip = (page - 1) * pageSize

  const order = parseSort(options.sort, paginateOptions.sortable)

  for (const [field, direction] of Object.entries(order)) {
    queryBuilder.addOrderBy(`${queryBuilder.alias}.${field}`, direction)
  }

  queryBuilder.skip(skip).take(pageSize)

  const [data, totalCount] = await queryBuilder.getManyAndCount()

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    data,
    meta: {
      totalCount,
      itemCount: data.length,
      pageSize,
      totalPages,
      currentPage: page,
    },
  }
}

function parseSort<T extends ObjectLiteral>(
  sort: string | undefined,
  sortable: readonly (keyof T)[] | undefined,
): Partial<Record<keyof T, 'ASC' | 'DESC'>> {
  if (!sort || !sortable) {
    return {}
  }

  const allowed = new Set(sortable)

  return Object.fromEntries(
    sort.split(',').map(value => {
      const descending = value.startsWith('-')

      const field = (descending ? value.slice(1) : value) as keyof T

      if (!allowed.has(field)) {
        throw new BadRequestException(`Invalid sort field: ${String(field)}`)
      }

      return [field, descending ? 'DESC' : 'ASC']
    }),
  ) as Partial<Record<keyof T, 'ASC' | 'DESC'>>
}
