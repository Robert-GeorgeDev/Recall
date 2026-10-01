export const STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export type Status = (typeof STATUSES)[number];

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  notes: string;
};
