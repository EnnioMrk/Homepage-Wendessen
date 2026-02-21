'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Descendant } from 'slate';
import Image from 'next/image';
import Modal from '@/app/components/ui/Modal';

interface ArticleRendererProps {
    content: Descendant[];
}

interface ImagePreviewProps {
    src: string;
    alt: string;
    onClose: () => void;
}

function ImagePreview({ src, alt, onClose }: ImagePreviewProps) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const minZoom = 0.5;
    const maxZoom = 8;
    const zoomStep = 0.15;

    const applyZoomDelta = useCallback((deltaY: number) => {
        const delta = deltaY > 0 ? -zoomStep : zoomStep;
        setZoom((prev) => {
            const newZoom = Math.min(maxZoom, Math.max(minZoom, prev + delta));
            // Reset position when zooming out to 1 or less
            if (newZoom <= 1) {
                setPosition({ x: 0, y: 0 });
            }
            return newZoom;
        });
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        applyZoomDelta(e.deltaY);
    }, [applyZoomDelta]);

    const handleWheelReact = useCallback(
        (e: React.WheelEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            applyZoomDelta(e.deltaY);
        },
        [applyZoomDelta]
    );

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
            // Only close if clicking on the backdrop, not while dragging
            if (!isDragging && e.target === e.currentTarget) {
                onClose();
            }
        },
        [isDragging, onClose]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        // Prevent default touch move to stop parent scrolling
        const preventTouchScroll = (e: TouchEvent) => e.preventDefault();

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchmove', preventTouchScroll, {
                passive: false,
            });
        }

        // Store original body overflow and set to hidden
        // Handled by Modal component

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (container) {
                container.removeEventListener('touchmove', preventTouchScroll);
            }
            // Restore original overflow value
            // Handled by Modal component
        };
    }, [handleKeyDown, handleWheel]);

    // Use Modal component for rendering
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
                className="w-full h-screen flex items-center justify-center bg-black/80 overflow-hidden overscroll-none"
                onClick={handleBackdropClick}
                onWheel={handleWheelReact}
                onWheelCapture={handleWheelReact}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    cursor:
                        zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-out',
                    touchAction: 'none',
                }}
            >
                {/* Close hint - positioned at top, outside image area */}
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
                        unoptimized
                    />
                </div>

                {/* Zoom indicator */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
                    {Math.round(zoom * 100)}%{' '}
                    {zoom > 1 && '• Ziehen zum Verschieben'}
                </div>
            </div>
        </Modal>
    );
}

export default function ArticleRenderer({ content }: ArticleRendererProps) {
    const [previewImage, setPreviewImage] = useState<{
        src: string;
        alt: string;
    } | null>(null);

    const renderNode = (node: Descendant, index: number): React.ReactNode => {
        if ('text' in node) {
            let text: React.ReactNode = node.text;

            if (node.bold) {
                text = <strong>{text}</strong>;
            }
            if (node.italic) {
                text = <em>{text}</em>;
            }
            if (node.underline) {
                text = <u>{text}</u>;
            }

            return <span key={index}>{text}</span>;
        }

        const element = node as {
            type: string;
            children: Descendant[];
            url?: string;
        };
        const children = element.children.map((child, idx) =>
            renderNode(child, idx)
        );

        switch (element.type) {
            case 'heading-one':
                return (
                    <h1
                        key={index}
                        className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
                    >
                        {children}
                    </h1>
                );
            case 'heading-two':
                return (
                    <h2
                        key={index}
                        className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900"
                    >
                        {children}
                    </h2>
                );
            case 'bulleted-list':
                return (
                    <ul
                        key={index}
                        className="list-disc list-outside ml-6 mb-6 space-y-2"
                    >
                        {children}
                    </ul>
                );
            case 'numbered-list':
                return (
                    <ol
                        key={index}
                        className="list-decimal list-outside ml-6 mb-6 space-y-2"
                    >
                        {children}
                    </ol>
                );
            case 'list-item':
                return (
                    <li key={index} className="text-gray-700 leading-relaxed">
                        {children}
                    </li>
                );
            case 'link':
                return (
                    <a
                        key={index}
                        href={element.url}
                        className="text-primary underline hover:text-primary-dark transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                );
            case 'image':
                const imageElement = element as {
                    type: 'image';
                    url: string;
                    alt?: string;
                    imageSize?: 'small' | 'medium' | 'large' | 'full';
                    position?: 'left' | 'center' | 'right';
                    textFlow?: boolean;
                    children: Descendant[];
                };

                const size = imageElement.imageSize || 'medium';
                const position = imageElement.position || 'center';
                const textFlow = imageElement.textFlow ?? false;

                const sizeStyles: Record<string, string> = {
                    small: '200px',
                    medium: '400px',
                    large: '600px',
                    full: '100%',
                };

                // Determine wrapper alignment (for non-flowing images)
                const getWrapperAlignment = (pos: string) => {
                    if (pos === 'left') return 'text-left';
                    if (pos === 'right') return 'text-right';
                    return 'text-center';
                };

                // For text flow, use float classes
                const getFloatClasses = (pos: string) => {
                    if (pos === 'left') return 'float-left mr-6 mb-4';
                    if (pos === 'right') return 'float-right ml-6 mb-4';
                    return '';
                };

                if (textFlow && position !== 'center') {
                    // Text flows around image
                    return (
                        <div
                            key={index}
                            className={getFloatClasses(position)}
                            style={{ maxWidth: sizeStyles[size] }}
                        >
                            <Image
                                src={imageElement.url}
                                alt={imageElement.alt || 'Bild'}
                                width={parseInt(sizeStyles[size]) || 400}
                                height={parseInt(sizeStyles[size]) || 400}
                                className="rounded-lg shadow-md w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={() =>
                                    setPreviewImage({
                                        src: imageElement.url,
                                        alt: imageElement.alt || 'Bild',
                                    })
                                }
                                unoptimized
                            />
                        </div>
                    );
                }

                // Image on its own line with alignment
                return (
                    <div
                        key={index}
                        className={`my-6 clear-both ${getWrapperAlignment(
                            position
                        )}`}
                    >
                        <div
                            className="inline-block"
                            style={{ maxWidth: sizeStyles[size] }}
                        >
                            <Image
                                src={imageElement.url}
                                alt={imageElement.alt || 'Bild'}
                                width={parseInt(sizeStyles[size]) || 400}
                                height={parseInt(sizeStyles[size]) || 400}
                                className="rounded-lg shadow-md w-full h-auto cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={() =>
                                    setPreviewImage({
                                        src: imageElement.url,
                                        alt: imageElement.alt || 'Bild',
                                    })
                                }
                                unoptimized
                            />
                            {imageElement.alt && (
                                <p className="text-sm text-gray-600 text-center mt-2 italic">
                                    {imageElement.alt}
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <p
                        key={index}
                        className="text-gray-700 mb-4 leading-relaxed"
                    >
                        {children}
                    </p>
                );
        }
    };

    return (
        <>
            <div className="prose prose-lg max-w-none">
                {content.map((node, index) => renderNode(node, index))}
            </div>

            {previewImage && (
                <ImagePreview
                    src={previewImage.src}
                    alt={previewImage.alt}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </>
    );
}
