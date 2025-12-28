import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY || '');
  }

  async send(to: string, template: string, data: any) {
    await sgMail.send({
      to,
      from: 'noreply@promobrindes.com.br',
      templateId: template,
      dynamicTemplateData: data
    });
  }
}

export const emailService = new EmailService();
