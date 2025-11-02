import { Linking } from "react-native";
export const handleCall = (phone: string): void => {
  Linking.openURL(`tel:${phone}`);
};

export const handleEmail = (email: string): void => {
  Linking.openURL(`mailto:${email}`);
};

export const handleWhatsApp = (phone: string): void => {
  const cleanPhone = phone.replace(/[\s\-()]/g, "");
  Linking.openURL(`whatsapp://send?phone=591${cleanPhone}`);
};

export const handleWhatsAppWithMessage = (
  phone: string,
  message: string,
): void => {
  const cleanPhone = phone.replace(/[\s\-()]/g, "");
  const encodedMessage = encodeURIComponent(message);
  Linking.openURL(
    `whatsapp://send?phone=591${cleanPhone}&text=${encodedMessage}`,
  );
};
