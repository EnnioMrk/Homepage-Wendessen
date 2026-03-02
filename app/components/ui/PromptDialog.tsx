'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WarningCircle } from '@phosphor-icons/react';

interface PromptDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    detail?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    icon?: ReactNode;
    children?: ReactNode;
    accentColor?: string;
}

export default function PromptDialog({
    isOpen,
    title,
    description,
    detail,
    confirmText = 'Bestätigen',
    cancelText = 'Abbrechen',
    onConfirm,
    onCancel,
    icon,
    children,
    accentColor = 'primary',
}: PromptDialogProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsConfirming(false);
        }
    }, [isOpen]);

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

    const handleConfirm = async () => {
        if (isConfirming) return;
        setIsConfirming(true);
        try {
            await onConfirm();
        } finally {
            setIsConfirming(false);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            >
                {/* Content */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full"
                            style={{
                                backgroundColor:
                                    accentColor === 'red'
                                        ? '#fee2e2'
                                        : accentColor === 'primary'
                                          ? 'rgb(var(--primary) / 0.1)'
                                          : `${accentColor}1a`,
                                color:
                                    accentColor === 'red'
                                        ? '#dc2626'
                                        : accentColor === 'primary'
                                          ? 'rgb(var(--primary))'
                                          : accentColor,
                            }}
                        >
                            {icon ?? (
                                <WarningCircle
                                    className="h-12 w-12"
                                    weight="duotone"
                                />
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                {description}
                            </p>
                            {detail && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {detail}
                                </p>
                            )}
                        </div>
                    </div>

                    {children && (
                        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                            {children}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (isConfirming) return;
                            onCancel();
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:w-auto"
                        disabled={isConfirming}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="relative w-full rounded-lg px-5 py-3 text-base font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto"
                        style={{
                            backgroundColor:
                                accentColor === 'red'
                                    ? '#dc2626'
                                    : accentColor === 'primary'
                                      ? 'rgb(var(--primary))'
                                      : accentColor,
                        }}
                        disabled={isConfirming}
                        onMouseEnter={(e) => {
                            if (isConfirming) return;
                            if (accentColor === 'red') {
                                e.currentTarget.style.backgroundColor =
                                    '#b91c1c';
                            } else if (accentColor === 'primary') {
                                e.currentTarget.style.backgroundColor =
                                    'rgb(var(--primary-dark))';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (isConfirming) return;
                            if (accentColor === 'red') {
                                e.currentTarget.style.backgroundColor =
                                    '#dc2626';
                            } else if (accentColor === 'primary') {
                                e.currentTarget.style.backgroundColor =
                                    'rgb(var(--primary))';
                            }
                        }}
                    >
                        <span style={{ opacity: isConfirming ? 0 : 1 }}>
                            {confirmText}
                        </span>
                        {isConfirming && (
                            <span className="absolute inset-0 flex items-center justify-center gap-1">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-white"
                                        style={{
                                            animation:
                                                'pulse-opacity 1.2s ease-in-out infinite',
                                            animationDelay: `${i * 0.2}s`,
                                        }}
                                    />
                                ))}
                                <style jsx>{`
                                    @keyframes pulse-opacity {
                                        0%,
                                        100% {
                                            opacity: 0.3;
                                        }
                                        50% {
                                            opacity: 1;
                                        }
                                    }
                                `}</style>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
