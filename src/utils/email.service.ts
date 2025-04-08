import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');

  async sendWelcomeEmail(email: string) {
    this.logger.log(`Sent welcome email to: ${email}`);
    // Integrate with SendGrid / Mailgun / Resend here
  }

  async sendOTP(email: string, code: string) {
    this.logger.log(`Sent OTP code ${code} to: ${email}`);
  }
}
