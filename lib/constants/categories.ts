export interface CategoryConfig {
    id: string;
    label: string;
    bg?: string;
    bgLight?: string;
    text?: string;
    textDark?: string;
    border?: string;
    hover?: string;
    icon?: string;
}

export const EVENT_CATEGORIES: CategoryConfig[] = [
    {
        id: 'sitzung',
        label: 'Sitzung',
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-100',
        text: 'text-blue-600',
        textDark: 'text-blue-800',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-50',
        icon: 'users-three',
    },
    {
        id: 'veranstaltung',
        label: 'Veranstaltung',
        bg: 'bg-green-500',
        bgLight: 'bg-green-100',
        text: 'text-green-600',
        textDark: 'text-green-800',
        border: 'border-green-200',
        hover: 'hover:bg-green-50',
        icon: 'calendar-blank',
    },
    {
        id: 'sport',
        label: 'Sport',
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-100',
        text: 'text-orange-600',
        textDark: 'text-orange-800',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-50',
        icon: 'lightning',
    },
    {
        id: 'kultur',
        label: 'Kultur',
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-100',
        text: 'text-purple-600',
        textDark: 'text-purple-800',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-50',
        icon: 'music-notes-simple',
    },
    {
        id: 'notfall',
        label: 'Notfall',
        bg: 'bg-red-500',
        bgLight: 'bg-red-100',
        text: 'text-red-600',
        textDark: 'text-red-800',
        border: 'border-red-200',
        hover: 'hover:bg-red-50',
        icon: 'alert-circle',
    },
    {
        id: 'sonstiges',
        label: 'Sonstiges',
        bg: 'bg-gray-500',
        bgLight: 'bg-gray-100',
        text: 'text-gray-600',
        textDark: 'text-gray-800',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-50',
        icon: 'calendar',
    },
];

export const NEWS_CATEGORIES: CategoryConfig[] = [
    { id: 'allgemein', label: 'Allgemein', bgLight: 'bg-gray-100', text: 'text-gray-800' },
    { id: 'veranstaltung', label: 'Veranstaltung', bgLight: 'bg-green-100', text: 'text-green-800' },
    { id: 'ortsrat', label: 'Ortsrat', bgLight: 'bg-blue-100', text: 'text-blue-800' },
    { id: 'verein', label: 'Verein', bgLight: 'bg-purple-100', text: 'text-purple-800' },
    { id: 'feuerwehr', label: 'Feuerwehr', bgLight: 'bg-red-100', text: 'text-red-800' },
    { id: 'sport', label: 'Sport', bgLight: 'bg-blue-100', text: 'text-blue-800' },
    { id: 'kultur', label: 'Kultur', bgLight: 'bg-purple-100', text: 'text-purple-800' },
    { id: 'bau', label: 'Bau & Infrastruktur', bgLight: 'bg-amber-100', text: 'text-amber-800' },
    { id: 'wichtig', label: 'Wichtig', bgLight: 'bg-red-600', text: 'text-white' },
];

export const EVENT_CATEGORY_MAP = Object.fromEntries(EVENT_CATEGORIES.map(c => [c.id, c]));
export const NEWS_CATEGORY_MAP = Object.fromEntries(NEWS_CATEGORIES.map(c => [c.id, c]));
