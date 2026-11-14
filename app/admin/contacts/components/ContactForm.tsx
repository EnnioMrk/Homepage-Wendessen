'use client';

import { useEffect, useState } from 'react';
import styles from '../contacts.module.css';
import {
    CONTACT_PRIORITY_MAX,
    CONTACT_PRIORITY_MIN,
    CONTACT_PRIORITY_STOPS,
    getContactPriorityStop,
    normalizeLegacyImportance,
} from '@/lib/constants/contact-priorities';

export interface ContactData {
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    importance: number;
}

interface Organization {
    id: string;
    title: string;
}

interface ContactFormProps {
    initialData?: ContactData;
    onSubmit: (data: ContactData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const emptyContact: ContactData = {
    name: '',
    emails: [],
    phones: [],
    addresses: [],
    affiliations: [],
    importance: 0,
};

const PHONE_TYPES = ['Mobil', 'Privat', 'Geschäftlich', 'Fax', 'Sonstiges'];

function phoneTypeLabel(type: string): string {
    if (!type) return type;
    const labels: Record<string, string> = {
        mobil: 'Mobil',
        mobile: 'Mobil',
        privat: 'Privat',
        'geschäftlich': 'Geschäftlich',
        geschaeftlich: 'Geschäftlich',
        fax: 'Fax',
        sonstiges: 'Sonstiges',
    };
    const known = labels[type.toLowerCase()];
    return known ?? type.charAt(0).toUpperCase() + type.slice(1);
}

export default function ContactForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: ContactFormProps) {
    const getInitialFormData = (data?: ContactData): ContactData => {
        if (!data) {
            return emptyContact;
        }

        return {
            ...data,
            importance: normalizeLegacyImportance(data.importance),
        };
    };

    const [formData, setFormData] = useState<ContactData>(
        getInitialFormData(initialData),
    );    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [orgsError, setOrgsError] = useState(false);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const response = await fetch('/api/admin/organizations');
                if (response.ok) {
                    const data = await response.json();
                    setOrganizations(data.organizations || []);
                } else {
                    setOrgsError(true);
                }
            } catch (error) {
                console.error('Failed to fetch organizations', error);
                setOrgsError(true);
            }
        };
        fetchOrgs();
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formData.name.trim()) {
            setNameError('Bitte tragen Sie einen Namen ein.');
            return;
        }
        setNameError('');
        onSubmit(formData);
    };

    const addArrayItem = <T,>(key: keyof ContactData, item: T) => {
        setFormData((prev) => ({
            ...prev,
            [key]: [...(prev[key] as T[]), item],
        }));
    };

    const updateArrayItem = <T,>(
        key: keyof ContactData,
        index: number,
        item: T,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: (prev[key] as T[]).map((el, i) => (i === index ? item : el)),
        }));
    };

    const removeArrayItem = (key: keyof ContactData, index: number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: (prev[key] as unknown[]).filter((_, i) => i !== index),
        }));
    };

    const selectedPriority = getContactPriorityStop(formData.importance);

    return (
        <form className="panel" onSubmit={handleSubmit}>
            <div className="panel-head">
                <h2>Kontaktdaten</h2>
                <span className={styles.sub}>
                    Felder mit * sind erforderlich
                </span>
            </div>

            <div className="panel-body">
                <div className={styles.formGrid}>
                    <div className="field">
                        <label htmlFor="contact-name">Name *</label>
                        <input
                            className="input"
                            id="contact-name"
                            type="text"
                            required
                            autoComplete="name"
                            value={formData.name}
                            aria-invalid={nameError ? 'true' : undefined}
                            aria-describedby={
                                nameError ? 'contact-name-error' : undefined
                            }
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    name: event.target.value,
                                });
                                if (nameError) setNameError('');
                            }}
                        />
                        {nameError && (
                            <p className="error-text" id="contact-name-error">
                                {nameError}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="contact-priority">Priorität</label>
                        <div className={styles.priority}>
                            <div className={styles.priorityHead}>
                                <span
                                    className={styles.priorityValue}
                                    id="contact-priority-value"
                                >
                                    <strong>Priorität {formData.importance + 1}</strong> ·{' '}
                                    {selectedPriority.label}
                                </span>
                                <span className={styles.sub}>
                                    {selectedPriority.example}
                                </span>
                            </div>
                            <div className={styles.slice}>
                                <input
                                    className="priority-slider"
                                    id="contact-priority"
                                    type="range"
                                    min={CONTACT_PRIORITY_MIN}
                                    max={CONTACT_PRIORITY_MAX}
                                    step={1}
                                    value={formData.importance}
                                    aria-describedby="contact-priority-value"
                                    aria-valuetext={`Priorität ${formData.importance + 1} von ${CONTACT_PRIORITY_MAX + 1}, ${selectedPriority.label}`}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            importance: parseInt(
                                                event.target.value,
                                                10,
                                            ),
                                        })
                                    }
                                />
                                <div className={styles.ticks} aria-hidden="true">
                                    {CONTACT_PRIORITY_STOPS.map((stop) => (
                                        <span key={stop.value}>
                                            {stop.value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="hint">
                            0 ist der Standardkontakt, 7 die Spitze der
                            Ortsverwaltung.
                        </p>
                    </div>

                    <section className={styles.group} aria-labelledby="contact-emails">
                        <div className={styles.groupHead}>
                            <h3 className={styles.groupTitle} id="contact-emails">
                                E-Mail-Adressen
                            </h3>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => addArrayItem('emails', '')}
                            >
                                Hinzufügen
                            </button>
                        </div>
                        <div className={styles.rows}>
                            {formData.emails.length === 0 && (
                                <p className={styles.emptyRow}>
                                    Keine E-Mail-Adresse eingetragen.
                                </p>
                            )}
                            {formData.emails.map((email, index) => (
                                <div className={styles.row} key={index}>
                                    <div className="field">
                                        <label htmlFor={`contact-email-${index}`}>
                                            E-Mail {index + 1}
                                        </label>
                                        <input
                                            className="input"
                                            id={`contact-email-${index}`}
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            placeholder="name@beispiel.de"
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'emails',
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--danger"
                                        onClick={() =>
                                            removeArrayItem('emails', index)
                                        }
                                        aria-label={`E-Mail ${index + 1} entfernen`}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.group} aria-labelledby="contact-phones">
                        <div className={styles.groupHead}>
                            <h3 className={styles.groupTitle} id="contact-phones">
                                Telefonnummern
                            </h3>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() =>
                                    addArrayItem('phones', {
                                        type: 'Mobil',
                                        value: '',
                                    })
                                }
                            >
                                Hinzufügen
                            </button>
                        </div>
                        <div className={styles.rows}>
                            {formData.phones.length === 0 && (
                                <p className={styles.emptyRow}>
                                    Keine Telefonnummer eingetragen.
                                </p>
                            )}
                            {formData.phones.map((phone, index) => (
                                <div
                                    className={`${styles.row} ${styles.rowPhones}`}
                                    key={index}
                                >
                                    <div className="field">
                                        <label
                                            htmlFor={`contact-phone-type-${index}`}
                                        >
                                            Typ {index + 1}
                                        </label>
                                        <select
                                            className="select"
                                            id={`contact-phone-type-${index}`}
                                            value={phone.type}
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'phones',
                                                    index,
                                                    {
                                                        ...phone,
                                                        type: event.target.value,
                                                    },
                                                )
                                            }
                                        >
                                            {phone.type &&
                                                !PHONE_TYPES.includes(
                                                    phone.type,
                                                ) && (
                                                    <option value={phone.type}>
                                                        {phoneTypeLabel(
                                                            phone.type,
                                                        )}
                                                    </option>
                                                )}
                                            {PHONE_TYPES.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label
                                            htmlFor={`contact-phone-value-${index}`}
                                        >
                                            Nummer {index + 1}
                                        </label>
                                        <input
                                            className="input"
                                            id={`contact-phone-value-${index}`}
                                            type="tel"
                                            autoComplete="tel"
                                            value={phone.value}
                                            placeholder="05331 000000"
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'phones',
                                                    index,
                                                    {
                                                        ...phone,
                                                        value: event.target
                                                            .value,
                                                    },
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--danger"
                                        onClick={() =>
                                            removeArrayItem('phones', index)
                                        }
                                        aria-label={`Telefonnummer ${index + 1} entfernen`}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.group} aria-labelledby="contact-addresses">
                        <div className={styles.groupHead}>
                            <h3
                                className={styles.groupTitle}
                                id="contact-addresses"
                            >
                                Adressen
                            </h3>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => addArrayItem('addresses', '')}
                            >
                                Hinzufügen
                            </button>
                        </div>
                        <div className={styles.rows}>
                            {formData.addresses.length === 0 && (
                                <p className={styles.emptyRow}>
                                    Keine Adresse eingetragen.
                                </p>
                            )}
                            {formData.addresses.map((address, index) => (
                                <div className={styles.row} key={index}>
                                    <div className="field">
                                        <label
                                            htmlFor={`contact-address-${index}`}
                                        >
                                            Adresse {index + 1}
                                        </label>
                                        <input
                                            className="input"
                                            id={`contact-address-${index}`}
                                            type="text"
                                            autoComplete="street-address"
                                            value={address}
                                            placeholder="Straße, Hausnummer, Ort"
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'addresses',
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--danger"
                                        onClick={() =>
                                            removeArrayItem('addresses', index)
                                        }
                                        aria-label={`Adresse ${index + 1} entfernen`}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section
                        className={styles.group}
                        aria-labelledby="contact-affiliations"
                    >
                        <div className={styles.groupHead}>
                            <h3
                                className={styles.groupTitle}
                                id="contact-affiliations"
                            >
                                Zugehörigkeiten (Verein und Funktion)
                            </h3>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() =>
                                    addArrayItem('affiliations', {
                                        org: '',
                                        role: '',
                                    })
                                }
                            >
                                Hinzufügen
                            </button>
                        </div>
                        {orgsError && (
                            <div className="notice notice--warn">
                                <strong>Organisationen nicht geladen</strong>
                                <span>
                                    Die Auswahl der Vereine ist nicht verfügbar.
                                    Der Kontakt kann trotzdem gespeichert
                                    werden.
                                </span>
                            </div>
                        )}
                        <div className={styles.rows}>
                            {formData.affiliations.length === 0 && (
                                <p className={styles.emptyRow}>
                                    Keine Zugehörigkeit eingetragen.
                                </p>
                            )}
                            {formData.affiliations.map((aff, index) => (
                                <div
                                    className={`${styles.row} ${styles.rowAff}`}
                                    key={index}
                                >
                                    <div className="field">
                                        <label
                                            htmlFor={`contact-aff-org-${index}`}
                                        >
                                            Organisation {index + 1}
                                        </label>
                                        <select
                                            className="select"
                                            id={`contact-aff-org-${index}`}
                                            value={aff.org}
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'affiliations',
                                                    index,
                                                    {
                                                        ...aff,
                                                        org: event.target.value,
                                                    },
                                                )
                                            }
                                        >
                                            <option value="">
                                                Organisation wählen
                                            </option>
                                            {aff.org &&
                                                !organizations.some(
                                                    (org) =>
                                                        org.title === aff.org,
                                                ) && (
                                                    <option value={aff.org}>
                                                        {aff.org}
                                                    </option>
                                                )}
                                            {organizations.map((org) => (
                                                <option
                                                    key={org.id}
                                                    value={org.title}
                                                >
                                                    {org.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field">
                                        <label
                                            htmlFor={`contact-aff-role-${index}`}
                                        >
                                            Funktion {index + 1}
                                        </label>
                                        <input
                                            className="input"
                                            id={`contact-aff-role-${index}`}
                                            type="text"
                                            value={aff.role}
                                            placeholder="z. B. 1. Vorsitzende"
                                            onChange={(event) =>
                                                updateArrayItem(
                                                    'affiliations',
                                                    index,
                                                    {
                                                        ...aff,
                                                        role: event.target.value,
                                                    },
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--danger"
                                        onClick={() =>
                                            removeArrayItem(
                                                'affiliations',
                                                index,
                                            )
                                        }
                                        aria-label={`Zugehörigkeit ${index + 1} entfernen`}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <div className={styles.formFoot}>
                <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={onCancel}
                >
                    Abbrechen
                </button>
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Speichern …' : 'Speichern'}
                </button>
            </div>
        </form>
    );
}
