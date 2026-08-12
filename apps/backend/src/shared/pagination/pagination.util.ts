import { Repository, FindManyOptions, ObjectLiteral } from 'typeorm'
import { PaginationQueryDto } from './pagination-query.dto'
import { PaginatedResult } from '@repo/models'

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: PaginationQueryDto,
  searchOptions: FindManyOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const page = options.page && options.page > 0 ? options.page : 1
  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : 10

  // Calculate how many items to bypass
  const skip = (page - 1) * pageSize

  // Execute unified find and count database query
  const [data, totalCount] = await repository.findAndCount({
    ...searchOptions,
    take: pageSize,
    skip: skip,
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
