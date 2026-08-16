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
  const { pageSize, currentPage, search, sort = [] } = params

  const p = new URLSearchParams({
    pageSize: String(pageSize),
    page: String(currentPage),
  })

  if (search) {
    p.set('search', search)
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
