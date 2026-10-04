export type SeoPage = {
  slug: string;
  title: string;
  desc: string;
  h1: string;
  intro: string;
  points: { t: string; d: string }[];
};

export const PAGES: SeoPage[] = [
  {
    slug: "freelancers",
    title: "A simple CRM for freelancers | Octom",
    desc: "Octom shows freelancers who to contact today, so no lead or client goes quiet. Simple follow-ups, no sales suite.",
    h1: "A simple CRM for freelancers",
    intro:
      "Most freelance work comes from people you already talked to. Octom keeps track of them and tells you who is due for a message today.",
    points: [
      { t: "One list for today", d: "Open the app and see who needs a reply, a check-in or a reminder." },
      { t: "Drafts when you need them", d: "Get a first version of the message and edit it in your own words." },
      { t: "Import what you have", d: "Bring contacts from a spreadsheet with a CSV file." },
    ],
  },
  {
    slug: "agencies",
    title: "A lightweight CRM for small agencies | Octom",
    desc: "Octom helps small agencies keep client and lead follow-ups in one shared workspace, without the weight of a full CRM suite.",
    h1: "A lightweight CRM for small agencies",
    intro:
      "Small agencies lose leads in inboxes and chat threads. Octom gives the team one shared place for follow-ups.",
    points: [
      { t: "Shared workspace", d: "Invite teammates and see everyone's follow-ups or only your own." },
      { t: "Assign contacts", d: "Make it clear who owns each conversation." },
      { t: "Pipeline view", d: "See where each lead stands without configuring a complex system." },
    ],
  },
  {
    slug: "consultants",
    title: "Follow-up CRM for consultants | Octom",
    desc: "Octom helps consultants stay in touch with prospects and past clients, with a daily list of who to contact.",
    h1: "A follow-up CRM for consultants",
    intro:
      "Consulting depends on trust built over time. Octom helps you keep in touch with prospects and past clients without a spreadsheet.",
    points: [
      { t: "Remember the context", d: "Keep notes and history next to each contact." },
      { t: "Never lose the thread", d: "Set the next follow-up date as soon as a conversation ends." },
      { t: "Your data in the EU", d: "Data is stored in Frankfurt." },
    ],
  },
  {
    slug: "small-teams",
    title: "A simple CRM for small B2B teams | Octom",
    desc: "Octom is a simple shared CRM for small B2B teams. Follow-ups, assignees and a pipeline, without the clutter.",
    h1: "A simple CRM for small B2B teams",
    intro:
      "A small team does not need a large system. It needs to know who talks to whom and when. Octom covers that and little else.",
    points: [
      { t: "Built for a few people", d: "The Business plan supports up to 5 users in one workspace." },
      { t: "Open source core", d: "The code is public under the AGPL-3.0 license." },
      { t: "English and Romanian", d: "The interface works in both languages." },
    ],
  },
];
