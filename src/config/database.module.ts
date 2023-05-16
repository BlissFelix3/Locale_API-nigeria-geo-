import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey, ApiKeySchema } from 'src/auth/key';
import { ApiKeyService } from 'src/auth/key';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
  ],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class MongodbModule implements OnModuleInit {
  constructor(private readonly mongoose) {}
  async onModuleInit() {
    try {
      this.mongoose.connection.on('connected', () => {
        console.log('Database connection established');
      });

      this.mongoose.connection.on('error', (error) => {
        throw new Error(`Database connection error: ${error}`);
      });
    } catch (error) {
      throw new Error(`Database connection error: ${error}`);
    }
  }
}
