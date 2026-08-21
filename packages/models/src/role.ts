export const userRoles = ['staff', 'provider', 'admin', 'owner'] as const
export type UserRole = (typeof userRoles)[number]

export const mockUserRole = () =>
  userRoles[~~(Math.random() * userRoles.length)]
