import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserEventsPublisher {
  private readonly logger = new Logger('UserEvents');

  emitUserRegistered(user: { id: string; email: string }) {
    this.logger.log(`User registered: ${user.email}`);
    // Future: emit to NATS/Kafka/etc.
  }

  emitSocialLogin(user: { id: string; provider: string }) {
    this.logger.log(`Social login: ${user.id} via ${user.provider}`);
  }
}
