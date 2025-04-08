import { Module, Global, Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.client.connect().catch(console.error);
  }

  async set(key: string, value: string, options?: { EX?: number }) {
    return this.client.set(key, value, options);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
