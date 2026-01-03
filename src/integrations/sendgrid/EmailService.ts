import sgMail from '@sendgrid/mail';

export interface EmailTemplateData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface SendEmailOptions {
  to: string;
  template: string;
  data: EmailTemplateData;
  from?: string;
  replyTo?: string;
}

export class EmailService {
  private from: string = 'noreply@promobrindes.com.br';

  constructor() {
    const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
  }

  async send(to: string, template: string, data: EmailTemplateData): Promise<void> {
    await sgMail.send({
      to,
      from: this.from,
      templateId: template,
      dynamicTemplateData: data
    });
  }

  async sendWithOptions(options: SendEmailOptions): Promise<void> {
    await sgMail.send({
      to: options.to,
      from: options.from || this.from,
      replyTo: options.replyTo,
      templateId: options.template,
      dynamicTemplateData: options.data
    });
  }
}

export const emailService = new EmailService();
