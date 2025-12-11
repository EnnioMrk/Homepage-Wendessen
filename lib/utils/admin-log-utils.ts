/**
 * Client-safe utility functions for admin logs
 * These can be imported in both server and client components
 */

interface LogEntryForDescription {
    username: string | null;
    action: string;
    resourceTitle?: string | null;
    details?: Record<string, unknown> | null;
}

/**
 * Get human-readable action description in German
 */
export function getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
        'event.create': 'Termin erstellt',
        'event.update': 'Termin bearbeitet',
        'event.delete': 'Termin gelöscht',
        'event.cancel': 'Termin abgesagt',
        'event.uncancel': 'Termin wiederhergestellt',
        'news.create': 'Nachricht erstellt',
        'news.update': 'Nachricht bearbeitet',
        'news.delete': 'Nachricht gelöscht',
        'news.pin': 'Nachricht angepinnt',
        'news.unpin': 'Nachricht losgelöst',
        'gallery.upload': 'Bild hochgeladen',
        'gallery.edit': 'Bild bearbeitet',
        'gallery.delete': 'Bild gelöscht',
        'shared_gallery.approve': 'Impression genehmigt',
        'shared_gallery.reject': 'Impression abgelehnt',
        'shared_gallery.delete': 'Impression gelöscht',
        'portrait.approve': 'Portrait genehmigt',
        'portrait.reject': 'Portrait abgelehnt',
        'portrait.reset': 'Portrait zurückgesetzt',
        'portrait.delete': 'Portrait gelöscht',
        'user.create': 'Benutzer erstellt',
        'user.update': 'Benutzer bearbeitet',
        'user.delete': 'Benutzer gelöscht',
        'user.password_reset': 'Passwort zurückgesetzt',
        'settings.update': 'Einstellungen geändert',
        'auth.login': 'Angemeldet',
        'auth.logout': 'Abgemeldet',
        'auth.password_change': 'Passwort geändert',
        'archive.create': 'Archiv erstellt',
        'archive.update': 'Archiv bearbeitet',
        'archive.delete': 'Archiv gelöscht',
    };

    return descriptions[action] || action;
}

/**
 * Get a full descriptive sentence for a log entry in German
 */
export function getLogSentence(log: LogEntryForDescription): string {
    const username = log.username || 'Unbekannt';
    const details = log.details || {};
    const resourceTitle = log.resourceTitle;

    switch (log.action) {
        // Events
        case 'event.create': {
            const category = getCategoryLabel(details.category as string);
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat den Termin "${resourceTitle}"${categoryInfo} erstellt`;
        }
        case 'event.update':
            return `${username} hat den Termin "${resourceTitle}" bearbeitet`;
        case 'event.delete': {
            const category = getCategoryLabel(details.category as string);
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat den Termin "${resourceTitle}"${categoryInfo} gelöscht`;
        }
        case 'event.cancel': {
            const category = getCategoryLabel(details.category as string);
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat den Termin "${resourceTitle}"${categoryInfo} abgesagt`;
        }
        case 'event.uncancel':
            return `${username} hat den Termin "${resourceTitle}" wiederhergestellt`;

        // News
        case 'news.create': {
            const category = getNewsCategoryLabel(details.category as string);
            const categoryInfo = category ? ` in "${category}"` : '';
            return `${username} hat die Nachricht "${resourceTitle}"${categoryInfo} erstellt`;
        }
        case 'news.update': {
            const category = getNewsCategoryLabel(details.category as string);
            const categoryInfo = category ? ` in "${category}"` : '';
            return `${username} hat die Nachricht "${resourceTitle}"${categoryInfo} bearbeitet`;
        }
        case 'news.delete': {
            const category = getNewsCategoryLabel(details.category as string);
            const categoryInfo = category ? ` in "${category}"` : '';
            return `${username} hat die Nachricht "${resourceTitle}"${categoryInfo} gelöscht`;
        }
        case 'news.pin': {
            const category = getNewsCategoryLabel(details.category as string);
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat die Nachricht "${resourceTitle}"${categoryInfo} angepinnt`;
        }
        case 'news.unpin': {
            const category = getNewsCategoryLabel(details.category as string);
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat die Nachricht "${resourceTitle}"${categoryInfo} losgelöst`;
        }

        // Gallery
        case 'gallery.upload': {
            const originalName = details.originalName as string | undefined;
            const info = originalName ? ` (Original: ${originalName})` : '';
            return `${username} hat das Bild "${resourceTitle}"${info} hochgeladen`;
        }
        case 'gallery.edit': {
            const originalName = details.originalName as string | undefined;
            const info = originalName ? ` (Original: ${originalName})` : '';
            return `${username} hat das Bild "${resourceTitle}"${info} umbenannt`;
        }
        case 'gallery.delete': {
            const originalName = details.originalName as string | undefined;
            const info = originalName ? ` (Original: ${originalName})` : '';
            return `${username} hat das Bild "${resourceTitle}"${info} gelöscht`;
        }

        // Shared Gallery
        case 'shared_gallery.approve': {
            const count = details.count as number | undefined;
            if (count && count > 1) {
                return `${username} hat ${count} Impressionen genehmigt`;
            }
            return `${username} hat eine Impression genehmigt`;
        }
        case 'shared_gallery.reject': {
            const count = details.count as number | undefined;
            const reason = details.reason as string | undefined;
            const reasonInfo = reason ? ` (Grund: ${reason})` : '';
            if (count && count > 1) {
                return `${username} hat ${count} Impressionen abgelehnt${reasonInfo}`;
            }
            return `${username} hat eine Impression abgelehnt${reasonInfo}`;
        }
        case 'shared_gallery.delete': {
            const submitter = resourceTitle;
            if (submitter) {
                return `${username} hat eine Impression von "${submitter}" gelöscht`;
            }
            return `${username} hat eine Impression gelöscht`;
        }

        // Portraits
        case 'portrait.approve': {
            const email = details.email as string | undefined;
            const emailInfo = email ? ` (${email})` : '';
            return `${username} hat das Portrait von "${resourceTitle}"${emailInfo} genehmigt`;
        }
        case 'portrait.reject': {
            const email = details.email as string | undefined;
            const emailInfo = email ? ` (${email})` : '';
            return `${username} hat das Portrait von "${resourceTitle}"${emailInfo} abgelehnt`;
        }
        case 'portrait.reset': {
            const email = details.email as string | undefined;
            const emailInfo = email ? ` (${email})` : '';
            return `${username} hat das Portrait von "${resourceTitle}"${emailInfo} zurückgesetzt`;
        }
        case 'portrait.delete': {
            const email = details.email as string | undefined;
            const emailInfo = email ? ` (${email})` : '';
            return `${username} hat das Portrait von "${resourceTitle}"${emailInfo} gelöscht`;
        }

        // Users
        case 'user.create': {
            const role = details.role as string | undefined;
            const roleInfo = role ? ` mit der Rolle "${role}"` : '';
            return `${username} hat den Benutzer "${resourceTitle}"${roleInfo} erstellt`;
        }
        case 'user.update':
            return formatUserUpdate(username, resourceTitle, details);
        case 'user.delete': {
            const role = details.role as string | undefined;
            const roleInfo = role ? ` (${role})` : '';
            return `${username} hat den Benutzer "${resourceTitle}"${roleInfo} gelöscht`;
        }
        case 'user.password_reset':
            return `${username} hat das Passwort von "${resourceTitle}" zurückgesetzt`;

        // Settings
        case 'settings.update':
            const changedKeys = details.changedKeys as string[] | undefined;
            if (changedKeys && changedKeys.length > 0) {
                const labels = changedKeys
                    .map((k) => getSettingLabel(k) || k)
                    .filter(Boolean);
                if (labels.length === 1) {
                    return `${username} hat die Einstellung "${labels[0]}" geändert`;
                } else if (labels.length <= 3) {
                    return `${username} hat die Einstellungen "${labels.join(
                        '", "'
                    )}" geändert`;
                } else {
                    return `${username} hat ${labels.length} Einstellungen geändert`;
                }
            }
            return `${username} hat die Einstellungen geändert`;

        // Auth
        case 'auth.login':
            return `${username} hat sich angemeldet`;
        case 'auth.logout':
            return `${username} hat sich abgemeldet`;
        case 'auth.password_change':
            return `${username} hat das Passwort geändert`;

        // Archive
        case 'archive.create': {
            const category = getArchiveCategoryLabel(
                details.category as string
            );
            const author = details.author as string | undefined;
            const categoryInfo = category ? ` in "${category}"` : '';
            const authorInfo = author ? ` von ${author}` : '';
            return `${username} hat den Archiv-Eintrag "${resourceTitle}"${categoryInfo}${authorInfo} erstellt`;
        }
        case 'archive.update': {
            const category = getArchiveCategoryLabel(
                details.category as string
            );
            const categoryInfo = category ? ` in "${category}"` : '';
            return `${username} hat den Archiv-Eintrag "${resourceTitle}"${categoryInfo} bearbeitet`;
        }
        case 'archive.delete': {
            const category = getArchiveCategoryLabel(
                details.category as string
            );
            const categoryInfo = category ? ` (${category})` : '';
            return `${username} hat den Archiv-Eintrag "${resourceTitle}"${categoryInfo} gelöscht`;
        }

        default:
            if (resourceTitle) {
                return `${username}: ${getActionDescription(
                    log.action
                )} - ${resourceTitle}`;
            }
            return `${username}: ${getActionDescription(log.action)}`;
    }
}

/**
 * Format user update action with detailed permission changes
 */
function formatUserUpdate(
    actorUsername: string,
    targetUsername: string | null | undefined,
    details: Record<string, unknown>
): string {
    const target = targetUsername || 'Unbekannt';
    const changes: string[] = [];

    // Role change
    if (details.roleChange) {
        const roleChange = details.roleChange as { from?: string; to?: string };
        if (roleChange.from && roleChange.to) {
            changes.push(
                `die Rolle von "${roleChange.from}" zu "${roleChange.to}" geändert`
            );
        } else if (roleChange.to) {
            changes.push(`die Rolle "${roleChange.to}" zugewiesen`);
        }
    }

    // Verein change
    if (details.vereinChange) {
        const vereinChange = details.vereinChange as {
            from?: string;
            to?: string;
        };
        if (vereinChange.to) {
            changes.push(`den Verein zu "${vereinChange.to}" geändert`);
        } else if (vereinChange.from) {
            changes.push(`die Verein-Zuordnung entfernt`);
        }
    }

    // Permission changes
    if (
        details.permissionsAdded &&
        Array.isArray(details.permissionsAdded) &&
        details.permissionsAdded.length > 0
    ) {
        const perms = (details.permissionsAdded as string[])
            .map((p) => getPermissionLabel(p))
            .join(', ');
        changes.push(
            `die Berechtigung${
                details.permissionsAdded.length > 1 ? 'en' : ''
            } "${perms}" hinzugefügt`
        );
    }

    if (
        details.permissionsRemoved &&
        Array.isArray(details.permissionsRemoved) &&
        details.permissionsRemoved.length > 0
    ) {
        const perms = (details.permissionsRemoved as string[])
            .map((p) => getPermissionLabel(p))
            .join(', ');
        changes.push(
            `die Berechtigung${
                details.permissionsRemoved.length > 1 ? 'en' : ''
            } "${perms}" entfernt`
        );
    }

    if (changes.length === 0) {
        return `${actorUsername} hat den Benutzer "${target}" bearbeitet`;
    }

    if (changes.length === 1) {
        return `${actorUsername} hat bei "${target}" ${changes[0]}`;
    }

    return `${actorUsername} hat bei "${target}": ${changes.join('; ')}`;
}

/**
 * Get human-readable permission label
 */
function getPermissionLabel(permission: string): string {
    const labels: Record<string, string> = {
        '*': 'Vollzugriff',
        'events.*': 'Termine (alle)',
        'events.view': 'Termine ansehen',
        'events.create': 'Termine erstellen',
        'events.edit': 'Termine bearbeiten',
        'events.delete': 'Termine löschen',
        'events.cancel': 'Termine absagen',
        'news.*': 'Neuigkeiten (alle)',
        'news.view': 'Neuigkeiten ansehen',
        'news.create': 'Neuigkeiten erstellen',
        'news.edit': 'Neuigkeiten bearbeiten',
        'news.delete': 'Neuigkeiten löschen',
        'news.pin': 'Neuigkeiten anpinnen',
        'gallery.*': 'Galerie (alle)',
        'gallery.view': 'Galerie ansehen',
        'gallery.upload': 'Galerie hochladen',
        'gallery.edit': 'Galerie bearbeiten',
        'gallery.delete': 'Galerie löschen',
        'shared_gallery.*': 'Impressionen (alle)',
        'shared_gallery.view': 'Impressionen ansehen',
        'shared_gallery.approve': 'Impressionen genehmigen',
        'shared_gallery.reject': 'Impressionen ablehnen',
        'shared_gallery.delete': 'Impressionen löschen',
        'shared_gallery.reset': 'Impressionen zurücksetzen',
        'portraits.*': 'Portraits (alle)',
        'portraits.view': 'Portraits ansehen',
        'portraits.edit': 'Portraits bearbeiten',
        'portraits.delete': 'Portraits löschen',
        'users.*': 'Benutzer (alle)',
        'users.view': 'Benutzer ansehen',
        'users.create': 'Benutzer erstellen',
        'users.edit': 'Benutzer bearbeiten',
        'users.delete': 'Benutzer löschen',
        'settings.*': 'Einstellungen (alle)',
        'settings.view': 'Einstellungen ansehen',
        'settings.edit': 'Einstellungen bearbeiten',
        'archive.*': 'Archiv (alle)',
        'archive.view': 'Archiv ansehen',
        'archive.create': 'Archiv erstellen',
        'archive.edit': 'Archiv bearbeiten',
        'archive.delete': 'Archiv löschen',
        'logs.view': 'Aktivitätslog ansehen',
        'verein.*': 'Verein (alle)',
        'verein.events.*': 'Verein-Termine (alle)',
        'verein.events.create': 'Verein-Termine erstellen',
        'verein.events.edit': 'Verein-Termine bearbeiten',
        'verein.events.delete': 'Verein-Termine löschen',
        'verein.events.cancel': 'Verein-Termine absagen',
    };

    return labels[permission] || permission;
}

/**
 * Get human-readable setting label
 */
function getSettingLabel(key: string): string | null {
    const labels: Record<string, string> = {
        site_title: 'Seitentitel',
        site_description: 'Seitenbeschreibung',
        contact_email: 'Kontakt-E-Mail',
        contact_phone: 'Kontakt-Telefon',
        contact_address: 'Kontakt-Adresse',
        footer_copyright: 'Footer Copyright',
        maintenance_mode: 'Wartungsmodus',
    };

    return labels[key] || null;
}

/**
 * Get human-readable event category label
 */
function getCategoryLabel(category: string | undefined): string | null {
    if (!category) return null;
    const labels: Record<string, string> = {
        sitzung: 'Sitzung',
        veranstaltung: 'Veranstaltung',
        sport: 'Sport',
        kultur: 'Kultur',
        notfall: 'Notfall',
        sonstiges: 'Sonstiges',
    };
    return labels[category] || category;
}

/**
 * Get human-readable news category label
 */
function getNewsCategoryLabel(category: string | undefined): string | null {
    if (!category) return null;
    const labels: Record<string, string> = {
        allgemein: 'Allgemein',
        kultur: 'Kultur',
        sport: 'Sport',
        vereine: 'Vereine',
        politik: 'Politik',
        jugend: 'Jugend',
        senioren: 'Senioren',
        umwelt: 'Umwelt',
    };
    return labels[category] || category;
}

/**
 * Get human-readable archive category label
 */
function getArchiveCategoryLabel(category: string | undefined): string | null {
    if (!category) return null;
    const labels: Record<string, string> = {
        chronik: 'Chronik',
        dokumente: 'Dokumente',
        fotos: 'Fotos',
        berichte: 'Berichte',
        sonstiges: 'Sonstiges',
    };
    return labels[category] || category;
}

/**
 * Get action category color for UI badges
 */
export function getActionColor(action: string): string {
    if (action.startsWith('event.')) return 'bg-blue-100 text-blue-800';
    if (action.startsWith('news.')) return 'bg-green-100 text-green-800';
    if (action.startsWith('gallery.') || action.startsWith('shared_gallery.'))
        return 'bg-purple-100 text-purple-800';
    if (action.startsWith('portrait.'))
        return 'bg-emerald-100 text-emerald-800';
    if (action.startsWith('user.')) return 'bg-orange-100 text-orange-800';
    if (action.startsWith('settings.')) return 'bg-gray-100 text-gray-800';
    if (action.startsWith('auth.')) return 'bg-indigo-100 text-indigo-800';
    if (action.startsWith('archive.')) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
}
