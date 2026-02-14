"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UiStrings } from "@/lib/types";

interface GetInTouchFormProps {
  uiStrings: UiStrings;
}

/**
 * Simple "Get in Touch" contact form (name, email, message). Distinct from the booking form.
 * Submit opens mailto with the message; optional success state.
 */
export function GetInTouchForm({ uiStrings }: GetInTouchFormProps) {
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
        <p className="font-medium text-foreground">{uiStrings.forms.messageSent}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {uiStrings.forms.messageSentHint}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="getintouch-name" className="mb-1 block text-sm font-medium text-foreground">
          {uiStrings.forms.name}
        </label>
        <input
          id="getintouch-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={uiStrings.forms.yourName}
        />
      </div>
      <div>
        <label htmlFor="getintouch-email" className="mb-1 block text-sm font-medium text-foreground">
          {uiStrings.forms.email}
        </label>
        <input
          id="getintouch-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={uiStrings.forms.yourEmail}
        />
      </div>
      <div>
        <label htmlFor="getintouch-message" className="mb-1 block text-sm font-medium text-foreground">
          {uiStrings.forms.message}
        </label>
        <textarea
          id="getintouch-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={uiStrings.forms.yourMessage}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {uiStrings.forms.sendMessage}
      </Button>
    </form>
  );
}
