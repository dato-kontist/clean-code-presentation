import { EmailSendingError } from "../../core";
import { EmailSenderPort } from "../ports";

export const CheapProviderEmailAdapter = (): EmailSenderPort => {
  return {
    sendEmail: async (email: string): Promise<void> => {
      try {
        console.log(`Sending email to ${email} via CheapProvider`);
      } catch (error) {
        throw new EmailSendingError((error as Error).message);
      }
    },
  };
};
