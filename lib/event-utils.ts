// Event category color utilities

export type EventCategory =
    | 'sitzung'
    | 'veranstaltung'
    | 'sport'
    | 'kultur'
    | 'notfall'
    | 'sonstiges';

// Category colors for different use cases
export const getCategoryColors = (category: EventCategory) => {
    const colorMap = {
        sitzung: {
            bg: 'bg-blue-500',
            bgLight: 'bg-blue-100',
            text: 'text-blue-600',
            textDark: 'text-blue-800',
            border: 'border-blue-200',
            hover: 'hover:bg-blue-50',
        },
        veranstaltung: {
            bg: 'bg-green-500',
            bgLight: 'bg-green-100',
            text: 'text-green-600',
            textDark: 'text-green-800',
            border: 'border-green-200',
            hover: 'hover:bg-green-50',
        },
        sport: {
            bg: 'bg-orange-500',
            bgLight: 'bg-orange-100',
            text: 'text-orange-600',
            textDark: 'text-orange-800',
            border: 'border-orange-200',
            hover: 'hover:bg-orange-50',
        },
        kultur: {
            bg: 'bg-purple-500',
            bgLight: 'bg-purple-100',
            text: 'text-purple-600',
            textDark: 'text-purple-800',
            border: 'border-purple-200',
            hover: 'hover:bg-purple-50',
        },
        notfall: {
            bg: 'bg-red-500',
            bgLight: 'bg-red-100',
            text: 'text-red-600',
            textDark: 'text-red-800',
            border: 'border-red-200',
            hover: 'hover:bg-red-50',
        },
        sonstiges: {
            bg: 'bg-gray-500',
            bgLight: 'bg-gray-100',
            text: 'text-gray-600',
            textDark: 'text-gray-800',
            border: 'border-gray-200',
            hover: 'hover:bg-gray-50',
        },
    };

    return colorMap[category] || colorMap.sonstiges;
};

// Get the solid background color for calendar events
export const getCategoryBackgroundColor = (category: string): string => {
    const cat = category as EventCategory;
    return getCategoryColors(cat).bg;
};

// Get light background and text color combination for badges/chips
export const getCategoryBadgeClasses = (category: string): string => {
    const cat = category as EventCategory;
    const colors = getCategoryColors(cat);
    return `${colors.bgLight} ${colors.text}`;
};

// Get category display name in German
export const getCategoryDisplayName = (category: string): string => {
    const displayNames = {
        sitzung: 'Sitzung',
        veranstaltung: 'Veranstaltung',
        sport: 'Sport',
        kultur: 'Kultur',
        notfall: 'Notfall',
        sonstiges: 'Sonstiges',
    };

    return displayNames[category as EventCategory] || 'Sonstiges';
};

// Get category icon (emoji)
export const getCategoryIconEmoji = (category: string): string => {
    const iconMap = {
        sitzung: '📋',
        veranstaltung: '🎉',
        sport: '⚽',
        kultur: '🎭',
        notfall: '🚨',
        sonstiges: '📅',
    };

    return iconMap[category as EventCategory] || '📅';
};
