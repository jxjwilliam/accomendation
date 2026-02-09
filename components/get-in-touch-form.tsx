"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Simple "Get in Touch" contact form (name, email, message). Distinct from the booking form.
 * Submit opens mailto with the message; optional success state.
 */
export function GetInTouchForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message ? `Message:\n${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const mailto = `mailto:?subject=${encodeURIComponent("Get in Touch - " + (name || "Visitor"))}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <p className="font-medium text-foreground">Message sent</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your email client should open. If not, you can email us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="getintouch-name" className="mb-1 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="getintouch-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="getintouch-email" className="mb-1 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="getintouch-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="getintouch-message" className="mb-1 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="getintouch-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your message..."
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
