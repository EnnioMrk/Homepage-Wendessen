import { getContactsByOrganizationId } from '@/lib/database/contacts';
import { getOrganizationById } from '@/lib/database/organizations';
import {
    getFallbackOrganizationById,
    getOrganizationLookupValues,
} from '@/lib/constants/organization-contact-lookup';
import { SectionHead } from '@/app/components/register/Layout';
import styles from './facts.module.css';

/**
 * Die Ansprechpartner eines Vereins aus dem Kontaktverzeichnis, gesetzt in der
 * Sprache des Registers: eine Karte, kein Schatten.
 *
 * Liefert nichts, wenn zu der Organisation keine Kontakte verzeichnet sind.
 */
export async function ClubContacts({
    organizationId,
    title = 'Ansprechpartner',
}: {
    organizationId: string;
    title?: string;
}) {
    let contacts: Awaited<ReturnType<typeof getContactsByOrganizationId>> = [];
    let roles: string[] = [];

    try {
        const [rows, storedOrganization] = await Promise.all([
            getContactsByOrganizationId(organizationId),
            getOrganizationById(organizationId),
        ]);

        const organization =
            storedOrganization ??
            getFallbackOrganizationById(organizationId) ??
            undefined;

        contacts = rows;
        roles = getOrganizationLookupValues(organization ?? null)
            .filter((value): value is string => Boolean(value?.trim()))
            .map((value) => value.trim().toLowerCase());
    } catch (error) {
        console.error(
            `Ansprechpartner für ${organizationId} konnten nicht geladen werden`,
            error,
        );
        return null;
    }

    if (contacts.length === 0) return null;

    const headingId = `kontakt-${organizationId}`;

    return (
        <section className="block" aria-labelledby={headingId}>
            <SectionHead title={title} id={headingId} />
            <div className="grid-2" style={{ marginTop: 'var(--s4)' }}>
                {contacts.map((contact) => {
                    const affiliation = contact.affiliations.find((entry) =>
                        roles.some((role) =>
                            entry.org.toLowerCase().includes(role),
                        ),
                    );
                    const role = affiliation?.role ?? 'Mitglied';
                    const phone = contact.phones[0]?.value;
                    const email = contact.emails[0];
                    const address = contact.addresses[0];

                    return (
                        <div className="person-card" key={contact.id}>
                            <p className="person-role">{role}</p>
                            <h3>{contact.name}</h3>
                            {phone || email || address ? (
                                <dl className={styles.facts}>
                                    {address && (
                                        <>
                                            <dt>Adresse</dt>
                                            <dd>{address}</dd>
                                        </>
                                    )}
                                    {phone && (
                                        <>
                                            <dt>Telefon</dt>
                                            <dd>
                                                <a
                                                    className="link"
                                                    href={`tel:${phone.replace(
                                                        /\s/g,
                                                        '',
                                                    )}`}
                                                >
                                                    {phone}
                                                </a>
                                            </dd>
                                        </>
                                    )}
                                    {email && (
                                        <>
                                            <dt>E-Mail</dt>
                                            <dd>
                                                <a
                                                    className="link"
                                                    href={`mailto:${email}`}
                                                >
                                                    {email}
                                                </a>
                                            </dd>
                                        </>
                                    )}
                                </dl>
                            ) : (
                                <p className="small muted">
                                    Keine Kontaktdaten angegeben.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
