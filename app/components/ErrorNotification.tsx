'use client';

import { X, WarningCircle } from '@phosphor-icons/react';
import { useEffect } from 'react';

interface ErrorNotificationProps {
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

export default function ErrorNotification({
    message,
    onClose,
    autoClose = true,
    duration = 5000,
}: ErrorNotificationProps) {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    return (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4 max-w-md">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <WarningCircle
                            className="h-5 w-5 text-red-600"
                            weight="fill"
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-red-800">
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-md text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
