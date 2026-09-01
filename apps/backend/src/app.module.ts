import { auth } from './auth.js'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module.js'
import { PracticesModule } from './practices/practices.module.js'
import { AddressesModule } from './addresses/addresses.module.js'
import { ClinicsModule } from './clinics/clinics.module.js'
import { DatabaseModule } from './database/database.module.js'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { InvitationsModule } from './invitations/invitations.module.js'
import { RequestContextModule } from './context/request-context.module.js'
import { APP_GUARD } from '@nestjs/core'
import { RequestContextGuard } from './context/request-context.guard.js'
import { AppointmentsModule } from './appointments/appointments.module.js'
import { PatientsModule } from './patients/patients.module.js'

const environment = process.env['NODE_ENV']

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // ...(environment === 'development'
    //   ? []
    //   : [
    //       AuthModule.forRoot({
    //         auth,
    //       }),
    //     ]),
    AuthModule.forRoot({ auth }),
    // ...(environment === 'development' ? [DatabaseModule] : []),
    UsersModule,
    RequestContextModule,
    DatabaseModule,
    PracticesModule,
    AddressesModule,
    ClinicsModule,
    InvitationsModule,
    AppointmentsModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RequestContextGuard },
  ],
})
// implements NestModule
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(bodyParser.json(), bodyParser.urlencoded({ extended: true }))
  //     .exclude(
  //       { path: 'api/auth/(.*)', method: RequestMethod.ALL },
  //       { path: 'api/auth', method: RequestMethod.ALL },
  //     )
  //     .forRoutes('*')
  // }
}
