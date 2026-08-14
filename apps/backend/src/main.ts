import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { RequestMethod } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import * as dotenv from 'dotenv'

dotenv.config({ quiet: true })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // app.enableCors({
  //   origin: '*',
  // })

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.GET,
      },
    ],
  })

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('The backend API description')
    .setVersion('0.0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const PORT = process.env.PORT ?? 8080
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
