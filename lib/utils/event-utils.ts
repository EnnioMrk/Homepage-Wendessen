import { EVENT_CATEGORY_MAP } from '../constants/categories';

export type EventCategory =
    | 'sitzung'
    | 'veranstaltung'
    | 'sport'
    | 'kultur'
    | 'notfall'
    | 'sonstiges';

// Category colors for different use cases
export const getCategoryColors = (category: string) => {
    const config = EVENT_CATEGORY_MAP[category] || EVENT_CATEGORY_MAP.sonstiges;
    
    return {
        bg: config.bg || 'bg-gray-500',
        bgLight: config.bgLight || 'bg-gray-100',
        text: config.text || 'text-gray-600',
        textDark: config.textDark || 'text-gray-800',
        border: config.border || 'border-gray-200',
        hover: config.hover || 'hover:bg-gray-50',
    };
};

// Get the solid background color for calendar events
export const getCategoryBackgroundColor = (category: string): string => {
    return getCategoryColors(category).bg;
};

// Get light background and text color combination for badges/chips
export const getCategoryBadgeClasses = (category: string): string => {
    const colors = getCategoryColors(category);
    return `${colors.bgLight} ${colors.text}`;
};

// Get category display name in German
export const getCategoryDisplayName = (category: string): string => {
    return EVENT_CATEGORY_MAP[category]?.label || 'Sonstiges';
};

// Get category icon key (use icon components in UI instead of emoji)
export const getCategoryIconEmoji = (category: string): string => {
    return EVENT_CATEGORY_MAP[category]?.icon || 'calendar';
};

