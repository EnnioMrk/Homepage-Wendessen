'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    className = '',
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    // Use z-[100] to be on top, but adjust top/padding so navbar is visible if desired
    return createPortal(
        <div className="fixed inset-x-0 bottom-0 top-[60px] z-[100] overflow-y-auto">
            <div className="flex items-start justify-center min-h-full p-4 text-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-x-0 bottom-0 top-[60px] transition-opacity bg-gray-500 bg-opacity-75"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel with animations */}
                <div
                    className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full mb-8 ${className}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
