export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_PER_REQUEST: 30,
  MAX_MESSAGES_TO_MODEL: 20,
  MAX_BODY_BYTES: 50_000,
};

export const CONTACT_INFO = {
  email: "anarghabhatta369@gmail.com",
  phone: "+91 900-781-6552",
};

export const FALLBACK_PORTFOLIO_CONTEXT = `
Portfolio owner contact details:
- Email: ${CONTACT_INFO.email}
- Phone: ${CONTACT_INFO.phone}

This is a 3D developer portfolio built with Next.js, React Three Fiber, GSAP, and Prismic CMS.
Visitors can browse projects and blog posts on the site.
`.trim();
