"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UiStrings } from "@/lib/types";

interface GetInTouchFormProps {
  uiStrings: UiStrings;
}

/**
 * "Get in Touch" contact form (name, email, message).
 * Submits via POST /api/contact; emails are forwarded to USER_EMAIL via Resend.
 */
export function GetInTouchForm({ uiStrings }: GetInTouchFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error ?? uiStrings.forms.formError);
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage(uiStrings.forms.formError);
    }
  };

  if (status === "success") {
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
          required
          disabled={status === "loading"}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          required
          disabled={status === "loading"}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          required
          disabled={status === "loading"}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={uiStrings.forms.yourMessage}
        />
      </div>
      {status === "error" && errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <Button type="submit" className="w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? uiStrings.forms.sending : uiStrings.forms.sendMessage}
      </Button>
    </form>
  );
}
