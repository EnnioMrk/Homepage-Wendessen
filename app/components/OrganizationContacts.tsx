import React from 'react';
import { getContactsByOrganization } from '@/lib/database/contacts';
import ContactCard from './ContactCard';

interface OrganizationContactsProps {
    organization: string;
    /**
     * Optional className to override text colors or other styles in the cards.
     */
    colorClassName?: string;
    /**
     * Optional limit of cards to show
     */
    limit?: number;
}

/**
 * Fetches and displays all contact cards associated with a specific organization.
 * Contacts are ordered by importance (desc) then name (asc).
 */
export default async function OrganizationContacts({
    organization,
    colorClassName,
    limit,
}: OrganizationContactsProps) {
    const contacts = await getContactsByOrganization(organization);

    if (contacts.length === 0) {
        return null;
    }

    const displayContacts = limit ? contacts.slice(0, limit) : contacts;

    return (
        <>
            {displayContacts.map((contact) => {
                // Find the specific role for this organization
                const affiliation = contact.affiliations.find((a) =>
                    a.org.toLowerCase().includes(organization.toLowerCase())
                );

                // If the user is affiliated with multiple similar org names,
                // we take the first match or default to 'Mitglied'
                const role = affiliation ? affiliation.role : 'Mitglied';

                // Get the first phone/email
                // Logic mimics ContactCardFetcher's behavior
                const phone =
                    contact.phones.length > 0 ? contact.phones[0].value : undefined;
                const email =
                    contact.emails.length > 0 ? contact.emails[0] : undefined;

                if (displayContacts.length === 1) {
                    return (
                        <div
                            key={contact.id}
                            className="md:col-span-2 flex justify-center"
                        >
                            <div className="w-full max-w-md">
                                <ContactCard
                                    name={contact.name}
                                    role={role}
                                    phone={phone}
                                    email={email}
                                    colorClassName={colorClassName}
                                />
                            </div>
                        </div>
                    );
                }

                return (
                    <ContactCard
                        key={contact.id}
                        name={contact.name}
                        role={role}
                        phone={phone}
                        email={email}
                        colorClassName={colorClassName}
                    />
                );
            })}
        </>
    );
}
