'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    showCloseButton?: boolean;
    maxWidth?:
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | '6xl'
        | '7xl'
        | 'full'
        | string;
    backdropBlur?: boolean;
    centered?: boolean;
    variant?: 'default' | 'none';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
};

export default function Modal({
    isOpen,
    onClose,
    children,
    className = '',
    maxWidth = '2xl',
    backdropBlur = false,
    centered = false,
    variant = 'default',
    rounded = '2xl',
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

    // Map maxWidth to Tailwind class
    const maxWidthClass = maxWidth.startsWith('max-w-')
        ? maxWidth
        : `max-w-${maxWidth}`;

    const isNoneVariant = variant === 'none';

    // Use z-[100] to be on top, but adjust top/padding so navbar is visible if desired
    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto print:static print:overflow-visible print:h-auto print:block">
            <div
                className={`flex min-h-full ${isNoneVariant ? '' : 'p-4'} text-center ${centered ? 'items-center' : 'items-start pt-[80px]'} justify-center print:block print:p-0`}
            >
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 transition-opacity bg-gray-500/75 ${backdropBlur ? 'backdrop-blur-sm' : ''} print:hidden`}
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel with animations */}
                <div
                    className={
                        isNoneVariant
                            ? `relative w-full ${className}`
                            : `relative inline-block align-bottom bg-white ${roundedClasses[rounded]} text-left overflow-hidden shadow-2xl transform transition-all w-full mb-8 ${maxWidthClass} print:shadow-none print:w-full print:mb-0 ${className}`
                    }
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}
