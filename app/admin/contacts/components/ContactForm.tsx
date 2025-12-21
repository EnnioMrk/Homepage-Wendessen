'use client';

import { useState } from 'react';
import { Plus, Trash, FloppyDisk } from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export interface ContactData {
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    sources: string[];
    importance: number;
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
    sources: [],
    importance: 0
};

export default function ContactForm({ initialData, onSubmit, onCancel, isSubmitting = false }: ContactFormProps) {
    const [formData, setFormData] = useState<ContactData>(initialData || emptyContact);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Helper for array modifications
    const addArrayItem = <T,>(key: keyof ContactData, item: T) => {
        setFormData(prev => ({
            ...prev,
            [key]: [...(prev[key] as T[]), item]
        }));
    };

    const updateArrayItem = <T,>(key: keyof ContactData, index: number, item: T) => {
        setFormData(prev => ({
            ...prev,
            [key]: (prev[key] as T[]).map((el, i) => i === index ? item : el)
        }));
    };

    const removeArrayItem = (key: keyof ContactData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [key]: (prev[key] as any[]).filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 shadow rounded-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Priorität (0 = Normal, höher = Höhere Priorität)</label>
                <input
                    type="number"
                    min="0"
                    value={formData.importance}
                    onChange={e => setFormData({ ...formData, importance: parseInt(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
            </div>

            {/* Emails */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">E-Mail Adressen</label>
                    <button type="button" onClick={() => addArrayItem('emails', '')} className="text-sm text-primary hover:text-primary-dark flex items-center">
                        <Plus size={16} className="mr-1" /> Hinzufügen
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.emails.map((email, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={e => updateArrayItem('emails', index, e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="E-Mail Adresse"
                            />
                            <button type="button" onClick={() => removeArrayItem('emails', index)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    {formData.emails.length === 0 && <p className="text-sm text-gray-500 italic">Keine E-Mails</p>}
                </div>
            </div>

            {/* Phones */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Telefonnummern</label>
                    <button type="button" onClick={() => addArrayItem('phones', { type: 'Mobil', value: '' })} className="text-sm text-primary hover:text-primary-dark flex items-center">
                        <Plus size={16} className="mr-1" /> Hinzufügen
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.phones.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                            <select
                                value={phone.type}
                                onChange={e => updateArrayItem('phones', index, { ...phone, type: e.target.value })}
                                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            >
                                <option value="Mobil">Mobil</option>
                                <option value="Privat">Privat</option>
                                <option value="Geschäftlich">Geschäftlich</option>
                                <option value="Fax">Fax</option>
                                <option value="Sonstiges">Sonstiges</option>
                            </select>
                            <input
                                type="text"
                                value={phone.value}
                                onChange={e => updateArrayItem('phones', index, { ...phone, value: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Nummer"
                            />
                            <button type="button" onClick={() => removeArrayItem('phones', index)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    {formData.phones.length === 0 && <p className="text-sm text-gray-500 italic">Keine Telefonnummern</p>}
                </div>
            </div>

            {/* Addresses */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Adressen</label>
                    <button type="button" onClick={() => addArrayItem('addresses', '')} className="text-sm text-primary hover:text-primary-dark flex items-center">
                        <Plus size={16} className="mr-1" /> Hinzufügen
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.addresses.map((address, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={address}
                                onChange={e => updateArrayItem('addresses', index, e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Adresse"
                            />
                            <button type="button" onClick={() => removeArrayItem('addresses', index)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    {formData.addresses.length === 0 && <p className="text-sm text-gray-500 italic">Keine Adressen</p>}
                </div>
            </div>

            {/* Affiliations */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Zugehörigkeiten (Verein/Funktion)</label>
                    <button type="button" onClick={() => addArrayItem('affiliations', { org: '', role: '' })} className="text-sm text-primary hover:text-primary-dark flex items-center">
                        <Plus size={16} className="mr-1" /> Hinzufügen
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.affiliations.map((aff, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={aff.org}
                                onChange={e => updateArrayItem('affiliations', index, { ...aff, org: e.target.value })}
                                className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Organisation / Verein"
                            />
                            <input
                                type="text"
                                value={aff.role}
                                onChange={e => updateArrayItem('affiliations', index, { ...aff, role: e.target.value })}
                                className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Rolle / Funktion"
                            />
                            <button type="button" onClick={() => removeArrayItem('affiliations', index)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    {formData.affiliations.length === 0 && <p className="text-sm text-gray-500 italic">Keine Zugehörigkeiten</p>}
                </div>
            </div>

            {/* Sources */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Quellen</label>
                    <button type="button" onClick={() => addArrayItem('sources', '')} className="text-sm text-primary hover:text-primary-dark flex items-center">
                        <Plus size={16} className="mr-1" /> Hinzufügen
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.sources.map((source, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={source}
                                onChange={e => updateArrayItem('sources', index, e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                placeholder="Quelle (z.B. Webseite)"
                            />
                            <button type="button" onClick={() => removeArrayItem('sources', index)} className="text-red-500 hover:text-red-700 p-2">
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                    {formData.sources.length === 0 && <p className="text-sm text-gray-500 italic">Keine Quellen</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Abbrechen
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : <FloppyDisk size={16} className="mr-2" />}
                    Speichern
                </button>
            </div>
        </form>
    );
}
