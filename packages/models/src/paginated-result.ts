export type PaginatedResult<T> = {
  data: T[]
  meta: {
    totalCount: number
    itemCount: number
    pageSize: number
    totalPages: number
    currentPage: number
  }
}
