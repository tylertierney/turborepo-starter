import {
  Repository,
  FindManyOptions,
  ObjectLiteral,
  FindOptionsOrder,
} from 'typeorm'
import { PaginationQueryDto } from './pagination-query.dto'
import { PaginatedResult } from '@repo/models'
import { BadRequestException } from '@nestjs/common'

interface PaginateOptions<T extends ObjectLiteral> extends FindManyOptions<T> {
  sortable?: readonly (keyof T)[]
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: PaginationQueryDto,
  searchOptions: PaginateOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const page = options.page && options.page > 0 ? options.page : 1
  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : 10

  const { sortable, ...findManyOptions } = searchOptions

  const order = parseSort(options.sort, sortable)

  // Calculate how many items to bypass
  const skip = (page - 1) * pageSize

  // Execute unified find and count database query
  const [data, totalCount] = await repository.findAndCount({
    ...searchOptions,
    take: pageSize,
    skip: skip,
    order: {
      ...(findManyOptions.order as FindOptionsOrder<T>),
      ...order,
    },
  })

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    data,
    meta: {
      totalCount,
      itemCount: data.length,
      pageSize: pageSize,
      totalPages,
      currentPage: page,
    },
  }
}

function parseSort<T extends ObjectLiteral>(
  sort: string | undefined,
  sortable: readonly (keyof T)[] | undefined,
): FindManyOptions<T>['order'] {
  if (!sort || !sortable) {
    return undefined
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
  ) as FindManyOptions<T>['order']
}
