'use client';

import { useState } from 'react';
import { CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react/dist/ssr';
import { DORFLEBEN_NAV, WOHNEN_BAUEN_NAV, KONTAKT_NAV, type NavItem } from '@/lib/constants/navigation';

interface NavGroup {
    label: string;
    items: { title: string; href: string }[];
}

function getGroupedNavLinks(): NavGroup[] {
    const groups: NavGroup[] = [];

    const extractLinks = (items: NavItem[]): { title: string; href: string }[] => {
        const links: { title: string; href: string }[] = [];
        items.forEach(item => {
            if (item.href) {
                links.push({ title: item.title, href: item.href });
            }
            if (item.items) {
                links.push(...extractLinks(item.items));
            }
        });
        return links;
    };

    groups.push({
        label: 'Hauptseiten',
        items: [
            { title: 'Home', href: '/' },
            { title: 'Was steht an?', href: '/was-steht-an' },
            { title: 'Geschichte', href: '/geschichte' },
            { title: 'Impressionen', href: '/impressionen' },
        ]
    });

    groups.push({
        label: 'Dorfleben',
        items: extractLinks(DORFLEBEN_NAV)
    });

    groups.push({
        label: 'Wohnen & Bauen',
        items: extractLinks(WOHNEN_BAUEN_NAV)
    });

    groups.push({
        label: 'Kontakt',
        items: extractLinks(KONTAKT_NAV)
    });

    return groups;
}

interface PageSelectorProps {
    value: string;
    onChange: (href: string) => void;
    placeholder?: string;
}

export default function PageSelector({ value, onChange, placeholder = 'Seite auswählen...' }: PageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const groupedNavLinks = getGroupedNavLinks();

    // Find current selection label
    const findLabel = (href: string): string | null => {
        for (const group of groupedNavLinks) {
            const item = group.items.find(i => i.href === href);
            if (item) return item.title;
        }
        return null;
    };

    const currentLabel = findLabel(value);

    // Filter groups based on search
    const filteredGroups = groupedNavLinks
        .map(group => ({
            ...group,
            items: group.items.filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.href.toLowerCase().includes(search.toLowerCase())
            )
        }))
        .filter(group => group.items.length > 0);

    const handleSelect = (href: string) => {
        onChange(href);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors gap-2 overflow-hidden"
            >
                <span className={`block truncate text-left flex-1 ${currentLabel ? 'text-gray-900' : 'text-gray-500'}`}>
                    {currentLabel || placeholder}
                </span>
                <CaretDown
                    size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>


            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                            setIsOpen(false);
                            setSearch('');
                        }}
                    />

                    {/* Dropdown */}
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                                <MagnifyingGlass
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Suchen..."
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredGroups.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    Keine Ergebnisse gefunden
                                </div>
                            ) : (
                                filteredGroups.map(group => (
                                    <div key={group.label}>
                                        {/* Group Header */}
                                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {group.label}
                                            </span>
                                        </div>

                                        {/* Group Items */}
                                        {group.items.map(item => (
                                            <button
                                                key={item.href}
                                                type="button"
                                                onClick={() => handleSelect(item.href)}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                                                    value === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                                }`}
                                            >
                                                {item.title}
                                            </button>
                                        ))}

                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
