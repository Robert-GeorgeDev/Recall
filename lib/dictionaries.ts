import { BRAND } from "@/lib/brand";
import { enSite, roSite } from "@/lib/dictionary-site";
import { enBilling, roBilling } from "@/lib/dictionary-billing";
import { enAssistant, roAssistant } from "@/lib/dictionary-assistant";
import { enTeam, roTeam } from "@/lib/dictionary-team";
import { enLand, roLand } from "@/lib/dictionary-landing";
import { enAccount, roAccount } from "@/lib/dictionary-account";
import { enPlans, roPlans } from "@/lib/dictionary-plans";
import { enLegal, roLegal } from "@/lib/dictionary-legal";
import { enAi, roAi } from "@/lib/dictionary-ai";
import { enData, roData } from "@/lib/dictionary-data";
import { enActivity, roActivity } from "@/lib/dictionary-activity";
import { enMore, roMore } from "@/lib/dictionary-more";
import { enHelp, roHelp } from "@/lib/dictionary-help";
import { enAdmin, roAdmin } from "@/lib/dictionary-admin";

const enBase = {
  "nav.dashboard": "Dashboard",
  "nav.contacts": "Contacts",
  "nav.addFollowUp": "Add follow-up",
  "nav.signOut": "Sign out",

  "common.loading": "Loading…",
  "common.error": "Something went wrong. Please try again.",

  "landing.login": "Log in",
  "landing.title": "You said you'd follow up.\nOctom remembers.",
  "landing.subtitle": "Octom shows you who to contact, when to follow up and what to do. No forgotten spreadsheets, nothing kept in your head.",
  "landing.cta": "Start free",
  "landing.how": "See how it works",
  "landing.howTitle": "How it works",
  "landing.step": "Step",
  "landing.s1.title": "Add a contact",
  "landing.s1.text": "Add the people you want to follow up with.",
  "landing.s2.title": "Schedule a follow-up",
  "landing.s2.text": "Pick a date and add a note.",
  "landing.s3.title": "Know who to contact today",
  "landing.s3.text": "Your dashboard shows what needs your attention.",

  "auth.createTitle": "Create your account",
  "auth.welcomeBack": "Welcome back",
  "auth.createSub": "Start free. No card needed.",
  "auth.loginSub": "Log in to see who to contact today.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.min8": "At least 8 characters.",
  "auth.wait": "Please wait…",
  "auth.createBtn": "Create account",
  "auth.loginBtn": "Log in",
  "auth.haveAccount": "Already have an account?",
  "auth.newHere": `New to ${BRAND}?`,
  "auth.createLink": "Create an account",
  "auth.checkEmail": "Check your email to confirm your account, then log in.",
  "auth.err.exists": "An account with this email already exists. Try logging in.",
  "auth.err.email": "Please enter a valid email address.",
  "auth.err.weak": "Please choose a stronger password.",
  "auth.err.credentials": "Incorrect email or password.",
  "auth.err.notConfirmed": "Please confirm your email first. Check your inbox.",
  "auth.err.rate": "Too many attempts. Please wait a moment and try again.",

  "onb.title": "What do you want to call your workspace?",
  "onb.sub": "Your company, your brand, or just your name. You can change it later.",
  "onb.label": "Workspace name",
  "onb.continue": "Continue",
  "onb.invalid": "Please enter a name (up to 80 characters).",

  "dash.morning": "Good morning",
  "dash.afternoon": "Good afternoon",
  "dash.evening": "Good evening",
  "dash.subtitle": "Here's what needs your attention.",
  "dash.openLeads": "Open leads",
  "dash.openFollowUps": "Open follow-ups",
  "dash.dueToday": "Due today",
  "dash.overdue": "Overdue",
  "dash.emptyTitle": "No follow-ups yet.",
  "dash.emptyText": "Schedule your first one so you know who to contact today.",
  "dash.nothingToday": "Nothing is due today.",
  "dash.schedule": "Today's schedule",
  "dash.scheduleEmpty": "Nothing scheduled for today.",
  "dash.anytime": "Anytime",
  "dash.loadError": "Could not load follow-ups. Please refresh the page.",

  "group.overdue": "Overdue",
  "group.today": "Today",
  "group.upcoming": "Upcoming",

  "card.complete": "Complete",
  "card.snooze": "Snooze",
  "card.delete": "Delete",
  "card.tomorrow": "Tomorrow",
  "card.nextWeek": "Next week",
  "card.pickDate": "Pick a date",
  "card.save": "Save",
  "card.newDate": "New date",
  "card.high": "High priority",
  "card.confirmDelete": "Delete this follow-up?",
};

const en = { ...enBase, ...enMore, ...enActivity, ...enData, ...enAi, ...enLegal, ...enPlans, ...enAccount, ...enLand, ...enTeam, ...enSite, ...enBilling, ...enAssistant, ...enHelp, ...enAdmin };
export type Key = keyof typeof en;

const roBase: Record<keyof typeof enBase, string> = {
  "nav.dashboard": "Panou",
  "nav.contacts": "Contacte",
  "nav.addFollowUp": "Adaugă follow-up",
  "nav.signOut": "Deconectare",

  "common.loading": "Se încarcă…",
  "common.error": "Ceva nu a mers. Te rugăm să încerci din nou.",

  "landing.login": "Autentificare",
  "landing.title": "Ai spus că revii.\nOctom ține minte.",
  "landing.subtitle": "Octom îți arată pe cine să contactezi, când să revii și ce ai de făcut. Fără tabele uitate și lucruri ținute în cap.",
  "landing.cta": "Începe gratuit",
  "landing.how": "Vezi cum funcționează",
  "landing.howTitle": "Cum funcționează",
  "landing.step": "Pasul",
  "landing.s1.title": "Adaugă un contact",
  "landing.s1.text": "Adaugă persoanele pe care vrei să le contactezi.",
  "landing.s2.title": "Programează un follow-up",
  "landing.s2.text": "Alege o dată și adaugă o notiță.",
  "landing.s3.title": "Află pe cine contactezi azi",
  "landing.s3.text": "Panoul tău arată ce are nevoie de atenția ta.",

  "auth.createTitle": "Creează-ți contul",
  "auth.welcomeBack": "Bine ai revenit",
  "auth.createSub": "Începe gratuit. Fără card.",
  "auth.loginSub": "Autentifică-te ca să vezi pe cine contactezi azi.",
  "auth.email": "Email",
  "auth.password": "Parolă",
  "auth.min8": "Cel puțin 8 caractere.",
  "auth.wait": "Te rugăm să aștepți…",
  "auth.createBtn": "Creează cont",
  "auth.loginBtn": "Autentifică-te",
  "auth.haveAccount": "Ai deja cont?",
  "auth.newHere": `Ești nou pe ${BRAND}?`,
  "auth.createLink": "Creează un cont",
  "auth.checkEmail": "Verifică-ți emailul pentru a confirma contul, apoi autentifică-te.",
  "auth.err.exists": "Există deja un cont cu acest email. Încearcă să te autentifici.",
  "auth.err.email": "Te rugăm să introduci o adresă de email validă.",
  "auth.err.weak": "Te rugăm să alegi o parolă mai puternică.",
  "auth.err.credentials": "Email sau parolă incorecte.",
  "auth.err.notConfirmed": "Confirmă mai întâi emailul. Verifică-ți inboxul.",
  "auth.err.rate": "Prea multe încercări. Așteaptă puțin și încearcă din nou.",

  "onb.title": "Cum vrei să-ți numești spațiul de lucru?",
  "onb.sub": "Compania ta, brandul tău sau pur și simplu numele tău. Îl poți schimba mai târziu.",
  "onb.label": "Numele spațiului de lucru",
  "onb.continue": "Continuă",
  "onb.invalid": "Introdu un nume (maximum 80 de caractere).",

  "dash.morning": "Bună dimineața",
  "dash.afternoon": "Bună ziua",
  "dash.evening": "Bună seara",
  "dash.subtitle": "Iată ce are nevoie de atenția ta.",
  "dash.openLeads": "Lead-uri deschise",
  "dash.openFollowUps": "Follow-up-uri deschise",
  "dash.dueToday": "Scadente azi",
  "dash.overdue": "Întârziate",
  "dash.emptyTitle": "Încă niciun follow-up.",
  "dash.emptyText": "Programează primul, ca să știi pe cine să contactezi azi.",
  "dash.nothingToday": "Nimic scadent azi.",
  "dash.schedule": "Programul de azi",
  "dash.scheduleEmpty": "Nimic programat pentru azi.",
  "dash.anytime": "Oricând",
  "dash.loadError": "Nu am putut încărca follow-up-urile. Reîncarcă pagina.",

  "group.overdue": "Întârziate",
  "group.today": "Azi",
  "group.upcoming": "Viitoare",

  "card.complete": "Finalizează",
  "card.snooze": "Amână",
  "card.delete": "Șterge",
  "card.tomorrow": "Mâine",
  "card.nextWeek": "Săptămâna viitoare",
  "card.pickDate": "Alege o dată",
  "card.save": "Salvează",
  "card.newDate": "Data nouă",
  "card.high": "Prioritate mare",
  "card.confirmDelete": "Ștergi acest follow-up?",
};

const ro: Record<Key, string> = { ...roBase, ...roMore, ...roActivity, ...roData, ...roAi, ...roLegal, ...roPlans, ...roAccount, ...roLand, ...roTeam, ...roSite, ...roBilling, ...roAssistant, ...roHelp, ...roAdmin };

export const dictionaries: Record<"en" | "ro", Record<Key, string>> = { en, ro };

export type Lang = keyof typeof dictionaries;
