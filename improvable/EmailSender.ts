export class EmailSender {
  async sendEmail(email: string): Promise<void> {
    console.log(`Sending email to ${email}`);
  }
}
