import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Default "from" address when no domain is verified. Resend allows onboarding@resend.dev for testing. */
const DEFAULT_FROM = "Manna Family Hotel <onboarding@resend.dev>";

/**
 * POST /api/contact
 * Sends contact form submission via Resend to USER_EMAIL.
 * Body: { name: string, email: string, message: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as { name?: string; email?: string; message?: string };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const toEmail = process.env.USER_EMAIL;
    if (!toEmail) {
      console.error("USER_EMAIL not configured");
      return NextResponse.json(
        { error: "Contact form is not configured" },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Contact form is not configured" },
        { status: 500 }
      );
    }

    const from = process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM;
    const subject = `Get in Touch - ${name.trim()}`;
    const text = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    const { data, error } = await resend.emails.send({
      from,
      to: [toEmail],
      replyTo: [email.trim()],
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send message" },
      { status: 500 }
    );
  }
}
