export const PRIORITIES = ["Low", "Normal", "High"] as const;

export type Priority = (typeof PRIORITIES)[number];

export type FollowUp = {
  id: string;
  contact_id: string;
  contact_name: string;
  company: string;
  due_date: string;
  due_time: string;
  priority: Priority;
  note: string;
  status: "open" | "done";
};
