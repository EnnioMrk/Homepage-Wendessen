import { permanentRedirect } from 'next/navigation';

/**
 * The short contact-scoped imprint is retired. The canonical legal text lives
 * at /impressum; the colophon still links here, so the route redirects instead
 * of disappearing.
 */
export default function KontaktImpressumPage() {
    permanentRedirect('/impressum');
}
