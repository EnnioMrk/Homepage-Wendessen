'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { Descendant } from 'slate';
import styles from './article.module.css';

interface ArticleRendererProps {
    content: Descendant[];
}

type ImageSize = 'small' | 'medium' | 'large' | 'full';
type ImagePosition = 'left' | 'center' | 'right';

interface SlateImageElement {
    type: 'image';
    url: string;
    alt?: string;
    imageSize?: ImageSize;
    position?: ImagePosition;
    textFlow?: boolean;
    children: Descendant[];
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.15;

const SIZE_CLASS: Record<ImageSize, string> = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
    full: styles.sizeFull,
};

const ALIGN_CLASS: Record<ImagePosition, string> = {
    left: styles.alignLeft,
    center: styles.alignCenter,
    right: styles.alignRight,
};

const FLOAT_CLASS: Record<ImagePosition, string> = {
    left: styles.floatLeft,
    center: '',
    right: styles.floatRight,
};

function clampZoom(value: number): number {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
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
    const overlayRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const changeZoom = useCallback((delta: number) => {
        setZoom((previous) => {
            const next = clampZoom(previous + delta);
            if (next <= 1) setPosition({ x: 0, y: 0 });
            return next;
        });
    }, []);

    const handleWheel = useCallback(
        (event: WheelEvent) => {
            event.preventDefault();
            changeZoom(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
        },
        [changeZoom],
    );

    // Escape closes, Tab stays inside the dialog, +/- zooms.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key === 'Tab') {
                const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
                    'button:not([disabled])',
                );
                if (!focusables || focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
                return;
            }
            if (event.key === '+' || event.key === '=') {
                event.preventDefault();
                changeZoom(ZOOM_STEP);
            }
            if (event.key === '-') {
                event.preventDefault();
                changeZoom(-ZOOM_STEP);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [changeZoom, onClose]);

    // The wheel must not scroll the page behind the dialog.
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const preventScroll = (event: TouchEvent) => event.preventDefault();
        stage.addEventListener('wheel', handleWheel, { passive: false });
        stage.addEventListener('touchmove', preventScroll, { passive: false });
        return () => {
            stage.removeEventListener('wheel', handleWheel);
            stage.removeEventListener('touchmove', preventScroll);
        };
    }, [handleWheel]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleMouseDown = (event: React.MouseEvent) => {
        if (zoom <= 1) return;
        event.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging || zoom <= 1) return;
        setPosition({
            x: event.clientX - dragStart.x,
            y: event.clientY - dragStart.y,
        });
    };

    const handleTouchStart = (event: React.TouchEvent) => {
        if (zoom <= 1 || event.touches.length !== 1) return;
        const touch = event.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        });
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        if (!isDragging || zoom <= 1 || event.touches.length !== 1) return;
        const touch = event.touches[0];
        setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
        });
    };

    const stopDragging = () => setIsDragging(false);

    const handleStageClick = (event: React.MouseEvent) => {
        if (!isDragging && event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div
            ref={overlayRef}
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Bildansicht"
        >
            <div className={styles.toolbar}>
                <p className={styles.zoomReadout} aria-live="polite">
                    {Math.round(zoom * 100)} %
                    {zoom > 1 ? ' · Ziehen verschiebt das Bild' : ''}
                </p>
                <div className={styles.tools}>
                    <button
                        type="button"
                        className={styles.toolButton}
                        onClick={() => changeZoom(-ZOOM_STEP)}
                        disabled={zoom <= MIN_ZOOM}
                    >
                        Verkleinern
                    </button>
                    <button
                        type="button"
                        className={styles.toolButton}
                        onClick={() => changeZoom(ZOOM_STEP)}
                        disabled={zoom >= MAX_ZOOM}
                    >
                        Vergrößern
                    </button>
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.toolButton}
                        onClick={onClose}
                    >
                        Schließen
                    </button>
                </div>
            </div>
            <div
                ref={stageRef}
                className={styles.stage}
                onClick={handleStageClick}
            >
                <div
                    className={styles.pan}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging
                            ? 'none'
                            : 'transform 100ms ease-out',
                        cursor:
                            zoom > 1
                                ? isDragging
                                    ? 'grabbing'
                                    : 'grab'
                                : 'zoom-out',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={stopDragging}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element -- stored Slate images carry no dimensions */}
                    <img
                        src={src}
                        alt={alt}
                        className={styles.stageImage}
                        draggable={false}
                    />
                </div>
            </div>
        </div>,
        document.body,
    );
}

/** Renders a stored Slate body in the register's reading style. */
export default function ArticleRenderer({ content }: ArticleRendererProps) {
    const [previewImage, setPreviewImage] = useState<{
        src: string;
        alt: string;
    } | null>(null);

    const openPreview = (src: string, alt: string) =>
        setPreviewImage({ src, alt });

    const renderNode = (node: Descendant, index: number): ReactNode => {
        if ('text' in node) {
            let text: ReactNode = node.text;

            if (node.bold) text = <strong>{text}</strong>;
            if (node.italic) text = <em>{text}</em>;
            if (node.underline) text = <u>{text}</u>;

            return <span key={index}>{text}</span>;
        }

        const element = node as {
            type: string;
            children: Descendant[];
            url?: string;
        };
        const children = element.children.map((child, childIndex) =>
            renderNode(child, childIndex),
        );

        switch (element.type) {
            case 'heading-one':
                return (
                    <h2 key={index} className={styles.heading}>
                        {children}
                    </h2>
                );
            case 'heading-two':
                return <h2 key={index}>{children}</h2>;
            case 'heading-three':
                return <h3 key={index}>{children}</h3>;
            case 'bulleted-list':
                return <ul key={index}>{children}</ul>;
            case 'numbered-list':
                return <ol key={index}>{children}</ol>;
            case 'list-item':
                return <li key={index}>{children}</li>;
            case 'link':
                return (
                    <a
                        key={index}
                        href={element.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                );
            case 'image': {
                const image = element as SlateImageElement;
                const size = image.imageSize ?? 'medium';
                const position = image.position ?? 'center';
                const textFlow = image.textFlow ?? false;
                const alt = image.alt?.trim() ?? '';
                const placement =
                    textFlow && position !== 'center'
                        ? FLOAT_CLASS[position]
                        : ALIGN_CLASS[position];

                return (
                    <figure
                        key={index}
                        className={[
                            styles.figure,
                            SIZE_CLASS[size],
                            placement,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <button
                            type="button"
                            className={styles.imageButton}
                            onClick={() => openPreview(image.url, alt)}
                            aria-label={
                                alt
                                    ? `Bild vergrößern: ${alt}`
                                    : 'Bild vergrößern'
                            }
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element -- stored Slate images carry no dimensions */}
                            <img
                                src={image.url}
                                alt={alt}
                                className={styles.image}
                                loading="lazy"
                            />
                        </button>
                        {alt && <figcaption>{alt}</figcaption>}
                    </figure>
                );
            }
            default:
                return <p key={index}>{children}</p>;
        }
    };

    return (
        <>
            <div className="prose">
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
