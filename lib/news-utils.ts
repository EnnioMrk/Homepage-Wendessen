export interface ColorClasses {
    borderColor: string;
    dotColor: string;
    hoverColor: string;
}

export function getCategoryColorClasses(category: string): ColorClasses {
    const colorMap: Record<string, ColorClasses> = {
        Bildung: {
            borderColor: '#f59e0b', // amber-500
            dotColor: '#f59e0b',
            hoverColor: '#f59e0b',
        },
        Gemeinschaft: {
            borderColor: '#059669', // green-600
            dotColor: '#059669',
            hoverColor: '#059669',
        },
        Feuerwehr: {
            borderColor: '#dc2626', // red-600
            dotColor: '#dc2626',
            hoverColor: '#dc2626',
        },
        Digital: {
            borderColor: '#6366f1', // indigo-500
            dotColor: '#6366f1',
            hoverColor: '#6366f1',
        },
        Sport: {
            borderColor: '#2563eb', // blue-600
            dotColor: '#2563eb',
            hoverColor: '#2563eb',
        },
        Kultur: {
            borderColor: '#9333ea', // purple-600
            dotColor: '#9333ea',
            hoverColor: '#9333ea',
        },
        Verwaltung: {
            borderColor: '#4b5563', // gray-600
            dotColor: '#4b5563',
            hoverColor: '#4b5563',
        },
    };

    // Return the color classes for the category, or default colors if category not found
    return (
        colorMap[category] || {
            borderColor: '#6b7280', // gray-500
            dotColor: '#6b7280',
            hoverColor: '#6b7280',
        }
    );
}
