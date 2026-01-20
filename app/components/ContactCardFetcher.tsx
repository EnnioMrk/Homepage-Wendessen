import React from 'react';
import { getContactByName } from '@/lib/database/contacts';
import ContactCard from './ContactCard';

interface ContactCardFetcherProps {
    name: string;
    colorClassName?: string;
    fallbackRole?: string;
    manualEmail?: string;
}

/**
 * A server component that fetches contact data from the database by name
 * and renders a ContactCard with the retrieved information.
 */
export default async function ContactCardFetcher({
    name,
    colorClassName,
    fallbackRole,
    manualEmail,
}: ContactCardFetcherProps) {
    const contact = await getContactByName(name);

    if (!contact) {
        return (
            <ContactCard
                name={name}
                role={fallbackRole || 'Kontakt'}
                email={manualEmail}
                colorClassName={colorClassName}
            />
        );
    }

    // Extract the primary role from affiliations
    // If there are multiple, we pick the first one, or try to find one that seems primary
    const role = contact.affiliations.length > 0
        ? contact.affiliations[0].role
        : fallbackRole || 'Mitglied';

    // Get the first phone number available
    const phone = contact.phones.length > 0
        ? contact.phones[0].value
        : undefined;

    // Get the first email available or use manualEmail
    const email = contact.emails.length > 0
        ? contact.emails[0]
        : manualEmail;

    return (
        <ContactCard
            name={contact.name}
            role={role}
            phone={phone}
            email={email}
            colorClassName={colorClassName}
        />
    );
}
