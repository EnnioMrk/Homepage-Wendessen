import { notFound } from 'next/navigation';
import ContactPersonCard from '../../components/ContactPersonCard';
import { getContactBySlug, getAllContactSlugs } from '../../lib/contact-data';

export async function generateStaticParams() {
    const slugs = getAllContactSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const contact = getContactBySlug(params.slug);

    if (!contact) {
        return {
            title: 'Kontakt nicht gefunden',
            description: 'Die angeforderte Kontaktseite wurde nicht gefunden.',
        };
    }

    return {
        title: `Kontakt ${contact.name} - ${contact.title} Wendessen`,
        description: `Kontaktinformationen von ${contact.name}, ${contact.title} von Wendessen. Telefon, E-Mail und Adresse.`,
    };
}

export default function ContactPage({ params }: { params: { slug: string } }) {
    const contact = getContactBySlug(params.slug);

    if (!contact) {
        notFound();
    }

    return (
        <ContactPersonCard
            name={contact.name}
            title={contact.title}
            subtitle={contact.subtitle}
            birthYear={contact.birthYear}
            profession={contact.profession}
            imageSrc={contact.imageSrc}
            imageAlt={contact.imageAlt}
            contactInfo={contact.contactInfo}
        />
    );
}
