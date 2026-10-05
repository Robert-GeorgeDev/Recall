import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to the Octom team.",
};

export default function ContactPage() {
  return <ContactForm />;
}
