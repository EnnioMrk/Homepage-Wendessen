'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import ImagePicker from './ImagePicker';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title?: string;
    initialValues?: {
        start?: string;
        end?: string;
        title?: string;
        description?: string;
        location?: string;
        category?: string;
        organizer?: string;
        imageUrl?: string;
    };
}

export default function EventModal({
    isOpen,
    onClose,
    onSuccess,
    title = 'Neuen Termin hinzufügen',
    initialValues,
}: EventModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        // Get form values
        const startDate = formData.get('startDate') as string;
        const startTime = formData.get('startTime') as string;
        const endDate = formData.get('endDate') as string;
        const endTime = formData.get('endTime') as string;

        // Determine if this is an all-day event (no times specified)
        const isAllDay = !startTime && !endTime;

        let startDateTime: string;
        let endDateTime: string;

        if (isAllDay) {
            // All-day event: start at beginning of start date, end at end of end date
            startDateTime = `${startDate}T00:00`;
            endDateTime = `${endDate}T23:59`;
        } else {
            // Timed event: combine date and time
            const startTimeValue = startTime || '00:00';
            const endTimeValue = endTime || '23:59';
            startDateTime = `${startDate}T${startTimeValue}`;
            endDateTime = `${endDate}T${endTimeValue}`;
        }

        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            start: startDateTime,
            end: endDateTime,
            location: formData.get('location'),
            category: formData.get('category'),
            organizer: formData.get('organizer'),
            imageUrl: imageUrl,
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
                // Reset form and image
                (e.target as HTMLFormElement).reset();
                setImageUrl('');
            } else {
                console.error('Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full mx-4">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {title}
                            </h3>

                            <div className="space-y-4">
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Titel"
                                    required
                                    disabled={isLoading}
                                    defaultValue={initialValues?.title || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Beschreibung"
                                    rows={3}
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.description || ''
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                />{' '}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Startdatum
                                        </label>
                                        <input
                                            name="startDate"
                                            type="date"
                                            required
                                            disabled={isLoading}
                                            defaultValue={
                                                initialValues?.start
                                                    ? initialValues.start.split(
                                                          'T'
                                                      )[0]
                                                    : ''
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                                        />
                                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                                            Startzeit (optional)
                                        </label>
                                        <input
                                            name="startTime"
                                            type="time"
                                            disabled={isLoading}
                                            defaultValue={
                                                initialValues?.start
                                                    ? initialValues.start.includes(
                                                          'T'
                                                      )
                                                        ? initialValues.start
                                                              .split('T')[1]
                                                              ?.substring(0, 5)
                                                        : ''
                                                    : ''
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Enddatum
                                        </label>
                                        <input
                                            name="endDate"
                                            type="date"
                                            required
                                            disabled={isLoading}
                                            defaultValue={
                                                initialValues?.end
                                                    ? initialValues.end.split(
                                                          'T'
                                                      )[0]
                                                    : ''
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                                        />
                                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                                            Endzeit (optional)
                                        </label>
                                        <input
                                            name="endTime"
                                            type="time"
                                            disabled={isLoading}
                                            defaultValue={
                                                initialValues?.end
                                                    ? initialValues.end.includes(
                                                          'T'
                                                      )
                                                        ? initialValues.end
                                                              .split('T')[1]
                                                              ?.substring(0, 5)
                                                        : ''
                                                    : ''
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                                <input
                                    name="location"
                                    type="text"
                                    placeholder="Ort"
                                    disabled={isLoading}
                                    defaultValue={initialValues?.location || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                />
                                <select
                                    name="category"
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.category || 'sonstiges'
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 text-gray-900"
                                >
                                    <option value="sonstiges">Sonstiges</option>
                                    <option value="sitzung">Sitzung</option>
                                    <option value="veranstaltung">
                                        Veranstaltung
                                    </option>
                                    <option value="sport">Sport</option>
                                    <option value="kultur">Kultur</option>
                                </select>
                                <input
                                    name="organizer"
                                    type="text"
                                    placeholder="Veranstalter"
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.organizer || ''
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bild (optional)
                                    </label>
                                    <div className="space-y-2">
                                        {imageUrl ? (
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                                                    <Image
                                                        src={imageUrl}
                                                        alt="Ausgewähltes Bild"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Bild ausgewählt
                                                    </p>
                                                    <p className="text-xs text-gray-700">
                                                        Wird in der
                                                        Terminübersicht
                                                        angezeigt
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setImageUrl('')
                                                    }
                                                    disabled={isLoading}
                                                    className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowImagePicker(true)
                                                }
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <ImageIcon className="w-5 h-5 text-gray-500 mr-2" />
                                                <span className="text-gray-700">
                                                    Bild aus Galerie wählen
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Erstelle...' : 'Erstellen'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Picker Modal */}
            {showImagePicker && (
                <ImagePicker
                    selectedImageUrl={imageUrl}
                    onImageSelect={(selectedImageUrl) => {
                        setImageUrl(selectedImageUrl || '');
                        setShowImagePicker(false);
                    }}
                    onClose={() => setShowImagePicker(false)}
                />
            )}
        </div>
    );
}
