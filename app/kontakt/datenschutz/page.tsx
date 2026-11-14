import { permanentRedirect } from 'next/navigation';

/**
 * The short contact-scoped privacy text is retired. The canonical text lives at
 * /datenschutz; links from the form and the colophon still point here.
 */
export default function KontaktDatenschutzPage() {
    permanentRedirect('/datenschutz');
}
