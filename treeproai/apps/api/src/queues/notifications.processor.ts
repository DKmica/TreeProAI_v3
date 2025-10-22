import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { Twilio } from "twilio";

@Injectable()
@Processor("notifications")
export class NotificationsProcessor extends WorkerHost {
  private readonly resend: Resend;
  private readonly twilio: Twilio;

  constructor() {
    super();
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async process(job: Job<{ quoteId: string; method: 'email' | 'sms'; recipient: string }>): Promise<void> {
    const { quoteId, method, recipient } = job.data;
    const quoteLink = `${process.env.NEXT_PUBLIC_APP_URL}/public/quotes/${quoteId}`;

    if (method === 'email') {
      await this.resend.emails.send({
        from: 'noreply@treeproai.com',
        to: recipient,
        subject: `Your Quote from TreeProAI is Ready!`,
        html: `<p>Your quote is ready. View it here: <a href="${quoteLink}">${quoteLink}</a></p>`,
      });
    } else if (method === 'sms') {
      await this.twilio.messages.create({
        body: `Your TreeProAI quote is ready: ${quoteLink}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: recipient,
      });
    }
  }
}