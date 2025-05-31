import { Timestamp } from "firebase/firestore";

// Convert Timestamp to Date
export const timestampToDate = (timestamp: Timestamp | undefined): Date | undefined => {
  return timestamp?.toDate();
};

// Convert Date to Timestamp
export const dateToTimestamp = (date: Date | undefined): Timestamp | undefined => {
  return date ? Timestamp.fromDate(date) : undefined;
};