/**
 * POST /api/contact — server-side handler for the contact form.
 *
 * Builds a MIME message from the form fields and sends it via the worker's
 * `CONTACT_EMAIL` send_email binding (configured in wrangler.jsonc). The
 * binding's `destination_address` is `info@kine-cocon.be`, a Cloudflare
 * Email Routing rule that forwards to the practice's inbox. The result:
 * every form submission is visible in two places — the practice's Hotmail
 * inbox and Cloudflare's Email Routing activity log.
 *
 * The visitor's email is set as `Reply-To` so hitting "Reply" in Hotmail
 * sends a response straight back to them (not to noreply@).
 */

import type { APIRoute } from 'astro';
import { EmailMessage } from 'cloudflare:email';
// Use the browser entrypoint — the default `mimetext` import pulls in
// `node:os` / `path`, which Cloudflare Workers don't ship. The browser
// build is API-equivalent and bundles cleanly into the worker.
import { createMimeMessage, Mailbox } from 'mimetext/browser';

export const prerender = false;

// Sender address — must be on a domain that has Cloudflare Email Routing
// enabled (kine-cocon.be). The local-part can be anything; we use
// `noreply@` to signal that nobody monitors that mailbox.
const SENDER_ADDRESS = 'noreply@kine-cocon.be';
const SENDER_NAME = 'Cocon contactformulier';
const RECIPIENT_ADDRESS = 'info@kine-cocon.be';

// Simple, permissive email validation — we let invalid addresses through
// the form rather than block on edge cases; spam is filtered downstream.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubmissionFields {
  name: string;
  email: string;
  message: string;
}

function parseFormData(form: FormData): { ok: true; fields: SubmissionFields } | { ok: false; error: string } {
  const name = (form.get('name') ?? '').toString().trim();
  const email = (form.get('email') ?? '').toString().trim();
  const message = (form.get('message') ?? '').toString().trim();

  if (!name || name.length > 200) return { ok: false, error: 'Naam ontbreekt of is te lang.' };
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) return { ok: false, error: 'E-mailadres is ongeldig.' };
  if (!message || message.length > 5000) return { ok: false, error: 'Bericht ontbreekt of is te lang.' };

  return { ok: true, fields: { name, email, message } };
}

function buildMime(fields: SubmissionFields): string {
  const { name, email, message } = fields;
  const msg = createMimeMessage();
  msg.setSender({ name: SENDER_NAME, addr: SENDER_ADDRESS });
  msg.setRecipient(RECIPIENT_ADDRESS);
  // Hotmail's "Reply" goes back to the visitor, not to noreply@.
  // mimetext's Reply-To header validator requires a Mailbox instance,
  // not a plain string — so we construct one explicitly. Passing the
  // visitor name + addr means Hotmail shows "Reply to <Name>" naturally.
  msg.setHeader('Reply-To', new Mailbox({ name, addr: email }));
  msg.setSubject(`Nieuw bericht van ${name}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      `Van: ${name} <${email}>`,
      '',
      message,
      '',
      '— ',
      'Verstuurd via het contactformulier op kine-cocon.be',
    ].join('\n'),
  });
  return msg.asRaw();
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  // Accept both multipart/form-data and application/x-www-form-urlencoded;
  // the contact form posts as FormData from the page script.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ ok: false, error: 'Ongeldige aanvraag.' }, 400);
  }

  const parsed = parseFormData(form);
  if (!parsed.ok) {
    return jsonResponse({ ok: false, error: parsed.error }, 400);
  }

  const raw = buildMime(parsed.fields);

  // EmailMessage is provided by the `cloudflare:email` runtime module; the
  // type is available through @cloudflare/workers-types but the runtime
  // class only exists inside the worker, so we use the explicit import above.
  const emailMsg = new EmailMessage(SENDER_ADDRESS, RECIPIENT_ADDRESS, raw);

  // Bindings live on locals.runtime.env in @astrojs/cloudflare. The
  // CONTACT_EMAIL binding is declared in wrangler.jsonc with
  // destination_address: "info@kine-cocon.be" — sending to any other
  // address would be rejected at the binding layer.
  const env = locals.runtime?.env as { CONTACT_EMAIL?: { send: (msg: EmailMessage) => Promise<void> } } | undefined;
  if (!env?.CONTACT_EMAIL) {
    // Misconfiguration safety net — happens locally when running the dev
    // server (the binding isn't wired up there). Surface a clear error so
    // it's obvious in the browser console / network tab.
    return jsonResponse(
      { ok: false, error: 'E-mail service is niet geconfigureerd in deze omgeving.' },
      503,
    );
  }

  try {
    await env.CONTACT_EMAIL.send(emailMsg);
  } catch (err) {
    // Cloudflare may reject the message (e.g. invalid sender domain, the
    // destination isn't a verified routing rule, rate limits). Bubble a
    // generic 500 to the client; the actual error is in Worker logs.
    console.error('[contact] send_email failed', err);
    return jsonResponse(
      { ok: false, error: 'Verzenden mislukt. Probeer het later opnieuw of mail rechtstreeks naar info@kine-cocon.be.' },
      500,
    );
  }

  return jsonResponse({ ok: true }, 200);
};
