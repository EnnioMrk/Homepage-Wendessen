import { describe, test, expect } from 'bun:test';
import {
    contactData,
    getContactBySlug,
    getAllContactSlugs,
} from '../../app/lib/contact-data';

describe('Contact Data', () => {
    describe('contactData array', () => {
        test('contains at least 5 contacts', () => {
            expect(contactData.length).toBeGreaterThanOrEqual(5);
        });

        test('all contacts have required fields', () => {
            contactData.forEach((contact) => {
                expect(contact.slug).toBeDefined();
                expect(typeof contact.slug).toBe('string');
                expect(contact.slug.length).toBeGreaterThan(0);

                expect(contact.name).toBeDefined();
                expect(typeof contact.name).toBe('string');

                expect(contact.title).toBeDefined();
                expect(typeof contact.title).toBe('string');

                expect(contact.subtitle).toBeDefined();
                expect(typeof contact.subtitle).toBe('string');

                expect(contact.birthYear).toBeDefined();
                expect(typeof contact.birthYear).toBe('number');
                expect(contact.birthYear).toBeGreaterThan(1900);
                expect(contact.birthYear).toBeLessThan(2010);

                expect(contact.profession).toBeDefined();
                expect(typeof contact.profession).toBe('string');

                expect(contact.imageSrc).toBeDefined();
                expect(contact.imageSrc.startsWith('/')).toBe(true);

                expect(contact.imageAlt).toBeDefined();
                expect(typeof contact.imageAlt).toBe('string');

                expect(contact.contactInfo).toBeDefined();
                expect(contact.contactInfo.address).toBeDefined();
                expect(contact.contactInfo.mobile).toBeDefined();
                expect(contact.contactInfo.email).toBeDefined();
            });
        });

        test('all contacts have unique slugs', () => {
            const slugs = contactData.map((c) => c.slug);
            const uniqueSlugs = new Set(slugs);
            expect(uniqueSlugs.size).toBe(slugs.length);
        });

        test('all contact slugs are URL-safe', () => {
            const urlSafePattern = /^[a-z0-9-]+$/;
            contactData.forEach((contact) => {
                expect(contact.slug).toMatch(urlSafePattern);
            });
        });

        test('all emails are valid format', () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            contactData.forEach((contact) => {
                expect(contact.contactInfo.email).toMatch(emailPattern);
            });
        });

        test('all mobile numbers are German format', () => {
            contactData.forEach((contact) => {
                // German mobile numbers start with 0 and have 10-15 digits
                expect(contact.contactInfo.mobile).toMatch(
                    /^0\d{3,4}\/?\d{5,10}$/
                );
            });
        });

        test('all addresses are in Wendessen', () => {
            contactData.forEach((contact) => {
                expect(contact.contactInfo.address).toContain('Wendessen');
            });
        });
    });

    describe('getContactBySlug', () => {
        test('returns correct contact for valid slug', () => {
            const contact = getContactBySlug('andreas-rink');
            expect(contact).toBeDefined();
            expect(contact?.name).toBe('Andreas Rink');
            expect(contact?.title).toBe('Ortsbürgermeister');
        });

        test('returns undefined for invalid slug', () => {
            const contact = getContactBySlug('non-existent-contact');
            expect(contact).toBeUndefined();
        });

        test('returns undefined for empty slug', () => {
            const contact = getContactBySlug('');
            expect(contact).toBeUndefined();
        });

        test('is case-sensitive', () => {
            const contact = getContactBySlug('Andreas-Rink');
            expect(contact).toBeUndefined();
        });
    });

    describe('getAllContactSlugs', () => {
        test('returns array of all slugs', () => {
            const slugs = getAllContactSlugs();
            expect(Array.isArray(slugs)).toBe(true);
            expect(slugs.length).toBe(contactData.length);
        });

        test('all returned slugs are strings', () => {
            const slugs = getAllContactSlugs();
            slugs.forEach((slug) => {
                expect(typeof slug).toBe('string');
            });
        });

        test('contains expected slugs', () => {
            const slugs = getAllContactSlugs();
            expect(slugs).toContain('andreas-rink');
            expect(slugs).toContain('christina-balder');
        });
    });

    describe('specific contacts', () => {
        test('Ortsbürgermeister is Andreas Rink', () => {
            const obm = contactData.find(
                (c) => c.title === 'Ortsbürgermeister'
            );
            expect(obm).toBeDefined();
            expect(obm?.name).toBe('Andreas Rink');
        });

        test('stellv. Ortsbürgermeisterin exists', () => {
            const stellv = contactData.find(
                (c) => c.title === 'stellv. Ortsbürgermeisterin'
            );
            expect(stellv).toBeDefined();
            expect(stellv?.name).toBe('Christina Balder');
        });

        test('all Ortsratsmitglieder have correct title', () => {
            const members = contactData.filter(
                (c) => c.title === 'Ortsratsmitglied'
            );
            expect(members.length).toBeGreaterThanOrEqual(5);
        });
    });

    describe('imageSrc paths', () => {
        test('all images point to Ortsrat directory', () => {
            contactData.forEach((contact) => {
                expect(contact.imageSrc).toMatch(/^\/images\/Ortsrat\//);
            });
        });

        test('all images have valid extensions', () => {
            const validExtensions = [
                '.jpg',
                '.jpeg',
                '.png',
                '.JPG',
                '.JPEG',
                '.PNG',
            ];
            contactData.forEach((contact) => {
                const hasValidExtension = validExtensions.some((ext) =>
                    contact.imageSrc.endsWith(ext)
                );
                expect(hasValidExtension).toBe(true);
            });
        });
    });
});
