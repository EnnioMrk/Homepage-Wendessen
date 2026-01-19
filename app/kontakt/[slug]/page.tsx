import { notFound } from 'next/navigation';
import ContactPersonCard from '../../components/ContactPersonCard';
import { getMemberBySlug, getAllMemberSlugs } from '@/lib/constants/members';

export async function generateStaticParams() {
    const slugs = getAllMemberSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const contact = getMemberBySlug(slug);

    if (!contact) {
        return {
            title: 'Kontakt nicht gefunden',
            description: 'Die angeforderte Kontaktseite wurde nicht gefunden.',
        };
    }

    return {
        title: `Kontakt ${contact.name} - ${contact.position || contact.role} Wendessen`,
        description: `Kontaktinformationen von ${contact.name}, ${contact.position || contact.role} von Wendessen. Telefon, E-Mail und Adresse.`,
    };
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const contact = getMemberBySlug(slug);

    if (!contact || !contact.contactInfo) {
        notFound();
    }

    return (
        <ContactPersonCard
            name={contact.name}
            title={contact.position || contact.role}
            subtitle={contact.subtitle}
            birthYear={contact.birthYear || 0}
            profession={contact.profession || ''}
            imageSrc={contact.imageSrc || ''}
            imageAlt={contact.imageAlt || contact.name}
            contactInfo={contact.contactInfo}
        />
    );
}

