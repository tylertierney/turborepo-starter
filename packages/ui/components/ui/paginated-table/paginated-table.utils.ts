import { DatatableParams, type Column } from './paginated-table'

export const mergeColDefs = <T>(
  ...defs: Array<Partial<Column<T>>>
): Column<T> => {
  return defs.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {} as Column<T>,
  ) as Column<T>
}

export const convertDatatableParamsToQueryString = <T>(
  params: DatatableParams<T>,
): string => {
  const { pageSize, currentPage, search, sort = [], filter = {} } = params

  const p = new URLSearchParams({
    pageSize: String(pageSize),
    page: String(currentPage),
  })

  if (search) {
    p.set('search', search)
  }

  const filters = Object.entries<string>(filter)

  for (const [filterBy, value] of filters) {
    p.set(filterBy, value)
  }

  if (sort.length) {
    p.set(
      'sort',
      sort
        .map(({ by, order }) => `${order === 'desc' ? '-' : ''}${by as string}`)
        .join(','),
    )
  }

  return '?' + p.toString()
}
