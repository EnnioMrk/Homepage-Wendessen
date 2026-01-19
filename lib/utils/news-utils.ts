

export interface ColorClasses {
    borderColor: string;
    dotColor: string;
    hoverColor: string;
}

export function getCategoryColorClasses(category: string): ColorClasses {
    // Standard Tailwind hexes matched to our category types
    const colorMap: Record<string, ColorClasses> = {
        allgemein: { borderColor: '#4b5563', dotColor: '#4b5563', hoverColor: '#4b5563' }, // gray-600
        veranstaltung: { borderColor: '#059669', dotColor: '#059669', hoverColor: '#059669' }, // green-600
        ortsrat: { borderColor: '#2563eb', dotColor: '#2563eb', hoverColor: '#2563eb' }, // blue-600
        verein: { borderColor: '#9333ea', dotColor: '#9333ea', hoverColor: '#9333ea' }, // purple-600
        feuerwehr: { borderColor: '#dc2626', dotColor: '#dc2626', hoverColor: '#dc2626' }, // red-600
        sport: { borderColor: '#2563eb', dotColor: '#2563eb', hoverColor: '#2563eb' }, // blue-600
        kultur: { borderColor: '#9333ea', dotColor: '#9333ea', hoverColor: '#9333ea' }, // purple-600
        bau: { borderColor: '#f59e0b', dotColor: '#f59e0b', hoverColor: '#f59e0b' }, // amber-500
        wichtig: { borderColor: '#dc2626', dotColor: '#dc2626', hoverColor: '#dc2626' }, // red-600
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

