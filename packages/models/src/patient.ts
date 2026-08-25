export const sexes = ['M', 'F'] as const
export type Sex = (typeof sexes)[number]

export const randSex = () => sexes[~~(Math.random() * sexes.length)]
