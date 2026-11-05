# EmailJS contact-form setup

The contact form uses the existing EmailJS service and template. Its template variables remain `user_name`, `user_email`, and `message`.

Implemented in code:
- A hidden honeypot blocks filled-in bot submissions.
- The EmailJS SDK throttles attempts to one per 15 seconds per browser storage, using the `portfolio-contact` ID.
- Duplicate submissions are blocked while sending.
- Invalid inputs never reach EmailJS; failed submissions preserve the text.

Account setup still needed:
1. Sign in at https://dashboard.emailjs.com/admin/account/security.
2. Under Domains, allow only the exact origins that should send messages. Include `http://localhost:3000` for local testing, plus the confirmed production origin. Origins include the scheme and optional port; they do not include paths or fragments. Do not add speculative domains or wildcards.
3. Confirm the template/service access settings in the existing account. EmailJS also applies service-side IP rate limits; the browser throttle does not replace account protections.
4. After setup, verify an unapproved origin is rejected. Send a real delivery test only when explicitly authorised by the site owner.

Official references:
- https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/
- https://www.emailjs.com/docs/sdk/options/
- https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/
