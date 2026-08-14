import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { PracticesModule } from './practices/practices.module'

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'mydatabase',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PracticesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
