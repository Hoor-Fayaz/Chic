"use client";

import ContactForm from "./ContactForm";

/**
 * Thin client wrapper so the server-rendered Contact page can pass
 * the dynamic contactPhone (from global settings) down to the form.
 */
export default function ContactFormWrapper({ contactPhone }) {
  return <ContactForm contactPhone={contactPhone} />;
}
