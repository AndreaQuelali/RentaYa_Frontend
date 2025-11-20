export enum NotificationType {
  NEW_INTEREST = "NEW_INTEREST",
  INTEREST_ACCEPTED = "INTEREST_ACCEPTED",
  INTEREST_REJECTED = "INTEREST_REJECTED",

  NEW_MESSAGE = "NEW_MESSAGE",

  PROPERTY_APPROVED = "PROPERTY_APPROVED",
  PROPERTY_REJECTED = "PROPERTY_REJECTED",
  PROPERTY_RENTED = "PROPERTY_RENTED",
  PROPERTY_AVAILABLE = "PROPERTY_AVAILABLE",

  NEW_REVIEW = "NEW_REVIEW",

  RECOMMENDATION = "RECOMMENDATION",
  PRICE_DROP = "PRICE_DROP",
  NEW_PROPERTY_AREA = "NEW_PROPERTY_AREA",
  NEW_PROPERTY = "NEW_PROPERTY",

  SYSTEM = "SYSTEM",
  WELCOME = "WELCOME",
  ACCOUNT_VERIFIED = "ACCOUNT_VERIFIED",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  read: boolean;
  deleted: boolean;
  pushSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType;
}

export interface UnreadCountResponse {
  count: number;
}
