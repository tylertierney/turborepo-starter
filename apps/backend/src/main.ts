import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { RequestMethod } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const environment = process.env['NODE_ENV']

const trustedOrigins =
  process.env['BETTER_AUTH_TRUSTED_ORIGINS']?.split(',')?.map(str => {
    const trimmed = str?.trim()
    return 'http://' + trimmed
  }) ?? []

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  })

  app.enableCors({
    origin: trustedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.GET,
      },
    ],
  })

  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Optometry API')
      .setDescription('API for interfacting with the Optometry app.')
      .setVersion('0.0.1')
      .addCookieAuth('better-auth.session_token', {
        type: 'apiKey',
        in: 'cookie',
        description: 'Better Auth Session Token Cookie',
      })
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        withCredentials: true,
      },
    })
  }

  const PORT = process.env.PORT ?? 8080
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
