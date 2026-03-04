'use client';

import { CheckCircle, X } from '@phosphor-icons/react';

interface SuccessPopupProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

export default function SuccessPopup({
    isOpen,
    message,
    onClose,
}: SuccessPopupProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    aria-label="Popup schließen"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle
                            className="h-8 w-8 text-emerald-600"
                            weight="fill"
                        />
                    </div>
                </div>

                <h3 className="mb-2 text-center text-xl font-bold text-emerald-700">
                    Erfolgreich gesendet
                </h3>
                <p className="text-center text-gray-700">{message}</p>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    );
}
