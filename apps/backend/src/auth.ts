import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const production = process.env['NODE_ENV'] === 'production'

const trustedOrigins =
  process.env['BETTER_AUTH_TRUSTED_ORIGINS']?.split(',')?.map(str => {
    const trimmed = str?.trim()
    return 'http://' + trimmed
  }) ?? []

export const auth = betterAuth({
  database: new Pool({
    host: process.env['DB_HOST'],
    port: Number(process.env['DB_PORT']),
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    options: '-c search_path=auth,public',
  }),
  // advanced: {
  //   database: {
  //     generateId: 'uuid',
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 256,
  },
  // advanced: {
  //   trustedProxyHeaders: true,
  // },
  trustedOrigins: production ? [] : trustedOrigins,
  baseURL: process.env['BETTER_AUTH_URL'],
})
