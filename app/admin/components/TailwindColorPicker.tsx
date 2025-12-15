import { useState, useRef, useEffect } from 'react';
import { PencilSimple, X, Check } from '@phosphor-icons/react';

interface TailwindColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const TAILWIND_COLORS: Record<string, string> = {
    slate: '#64748b',
    gray: '#6b7280',
    zinc: '#71717a',
    neutral: '#737373',
    stone: '#78716c',
    red: '#ef4444',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    lime: '#84cc16',
    green: '#22c55e',
    emerald: '#10b981',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    sky: '#0ea5e9',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    fuchsia: '#d946ef',
    pink: '#ec4899',
    rose: '#f43f5e'
};

const COLOR_GROUPS = [
    { name: 'Grau', colors: ['slate', 'gray', 'zinc', 'neutral', 'stone'] },
    { name: 'Warm', colors: ['red', 'orange', 'amber', 'yellow'] },
    { name: 'Grün/Blau', colors: ['lime', 'green', 'emerald', 'teal', 'cyan', 'sky'] },
    { name: 'Indigo/Violett/Pink', colors: ['blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'] },
];

export default function TailwindColorPicker({ value, onChange }: TailwindColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (color: string) => {
        onChange(color);
        setIsOpen(false);
    };

    const currentColorHex = TAILWIND_COLORS[value] || '#e5e7eb'; // Default gray-200

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all shadow-sm hover:shadow-md bg-white group"
                title="Farbe wählen"
                style={{ backgroundColor: value ? 'white' : '#f3f4f6' }}
            >
                {value ? (
                    <div
                        className="w-6 h-6 rounded-full border border-gray-100"
                        style={{ backgroundColor: currentColorHex }}
                    />
                ) : (
                    <PencilSimple className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-100 z-50 w-72 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Farbe wählen</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {COLOR_GROUPS.map((group) => (
                            <div key={group.name}>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {group.colors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleSelect(color)}
                                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 relative flex items-center justify-center ${value === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                                            style={{ backgroundColor: TAILWIND_COLORS[color] }}
                                        >
                                            {value === color && <Check size={12} className="text-white drop-shadow-md" weight="bold" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
