'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Modal from '@/app/components/ui/Modal';

interface ZoomableImageProps {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
    imageClassName?: string;
    framed?: boolean;
}

function ImagePreview({
    src,
    alt,
    onClose,
}: {
    src: string;
    alt: string;
    onClose: () => void;
}) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const minZoom = 0.5;
    const maxZoom = 8;
    const zoomStep = 0.15;

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        setZoom((prev) => {
            const newZoom = Math.min(maxZoom, Math.max(minZoom, prev + delta));
            if (newZoom <= 1) {
                setPosition({ x: 0, y: 0 });
            }
            return newZoom;
        });
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (zoom > 1) {
                e.preventDefault();
                setIsDragging(true);
                setDragStart({
                    x: e.clientX - position.x,
                    y: e.clientY - position.y,
                });
            }
        },
        [zoom, position]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isDragging && zoom > 1) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                });
            }
        },
        [isDragging, dragStart, zoom]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (zoom > 1 && e.touches.length === 1) {
                const touch = e.touches[0];
                setIsDragging(true);
                setDragStart({
                    x: touch.clientX - position.x,
                    y: touch.clientY - position.y,
                });
            }
        },
        [zoom, position]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (isDragging && zoom > 1 && e.touches.length === 1) {
                const touch = e.touches[0];
                setPosition({
                    x: touch.clientX - dragStart.x,
                    y: touch.clientY - dragStart.y,
                });
            }
        },
        [isDragging, dragStart, zoom]
    );

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging && e.target === e.currentTarget) {
                onClose();
            }
        },
        [isDragging, onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        const preventTouchScroll = (e: TouchEvent) => e.preventDefault();

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchmove', preventTouchScroll, {
                passive: false,
            });
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (container) {
                container.removeEventListener('touchmove', preventTouchScroll);
            }
        };
    }, [handleKeyDown, handleWheel]);

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            variant="none"
            maxWidth="full"
            className="h-screen w-screen !mb-0 overflow-hidden"
            centered
            backdropBlur
        >
            <div
                ref={containerRef}
                className="w-full h-screen flex items-center justify-center bg-black/80 overflow-hidden"
                onClick={handleBackdropClick}
                onWheelCapture={(e) => handleWheel(e.nativeEvent)}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    cursor:
                        zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-out',
                }}
            >
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10 pointer-events-none">
                    ESC oder Hintergrund klicken zum Schließen
                </div>

                <div
                    className="relative select-none"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={1200}
                        height={800}
                        className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
                        draggable={false}
                    />
                </div>

                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
                    {Math.round(zoom * 100)}% {zoom > 1 && '• Ziehen zum Verschieben'}
                </div>
            </div>
        </Modal>
    );
}

export default function ZoomableImage({
    src,
    alt,
    caption,
    className = '',
    imageClassName = '',
    framed = true,
}: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`my-8 ${className}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="block w-full text-left"
                >
                    {framed ? (
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={src}
                                alt={alt}
                                width={1200}
                                height={800}
                                className={`w-full h-auto object-cover cursor-zoom-in hover:opacity-95 transition-opacity ${imageClassName}`}
                            />
                        </div>
                    ) : (
                        <Image
                            src={src}
                            alt={alt}
                            width={1200}
                            height={800}
                            className={`w-full h-auto cursor-zoom-in hover:opacity-95 transition-opacity ${imageClassName}`}
                        />
                    )}
                </button>
                {caption && (
                    <p className="mt-3 text-center text-sm text-gray-500 italic">
                        {caption}
                    </p>
                )}
            </div>

            {isOpen && (
                <ImagePreview
                    src={src}
                    alt={alt}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
