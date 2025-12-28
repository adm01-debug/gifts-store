export class WhatsAppService {
  private apiUrl = 'https://graph.facebook.com/v18.0';

  async sendMessage(to: string, message: string) {
    const response = await fetch(`${this.apiUrl}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.VITE_WHATSAPP_TOKEN}` },
      body: JSON.stringify({ to, text: { body: message } })
    });
    return response.json();
  }
}

export const whatsappService = new WhatsAppService();
