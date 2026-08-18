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
    DatabaseModule,
    UsersModule,
    PracticesModule,
    AddressesModule,
    ClinicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
