export const PRIORITIES = ["Low", "Normal", "High"] as const;

export type Priority = (typeof PRIORITIES)[number];

export type FollowUp = {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  note: string;
  status: "open" | "done";
};
