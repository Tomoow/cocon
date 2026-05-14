/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

/**
 * Bindings configured in wrangler.jsonc. Mirror this whenever a new
 * resource is wired up there.
 */
interface Env {
  /** Cloudflare `send_email` binding for the contact form. Restricted to
   *  `info@kine-cocon.be` (the routing-rule address that forwards to the
   *  practice's Hotmail). */
  CONTACT_EMAIL: {
    send(msg: import('cloudflare:email').EmailMessage): Promise<void>;
  };
}
