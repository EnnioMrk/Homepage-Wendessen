'use client';

import { useState, useRef } from 'react';
import {
    Check,
    ArrowCounterClockwise,
    X,
} from '@phosphor-icons/react/dist/ssr';
import { ImageCrop, ImageCropConfig } from '@/lib/database/events';
import { IMAGE_CROP_CONFIGS } from '@/lib/constants/image-crops';

const areCropsEqual = (a: ImageCrop, b: ImageCrop) => {
    return (
        a.x === b.x &&
        a.y === b.y &&
        a.width === b.width &&
        a.height === b.height &&
        a.scale === b.scale
    );
};

const isValidCrop = (crop?: Partial<ImageCrop> | null): crop is ImageCrop => {
    if (!crop) return false;

    return (
        Number.isFinite(crop.x) &&
        Number.isFinite(crop.y) &&
        Number.isFinite(crop.width) &&
        Number.isFinite(crop.height) &&
        Number.isFinite(crop.scale) &&
        (crop.width as number) > 0 &&
        (crop.height as number) > 0
    );
};

interface ImageCropperProps {
    imageUrl: string;
    initialCrops?: ImageCropConfig;
    onSave: (crops: ImageCropConfig) => void;
    onCancel: () => void;
}

export default function ImageCropper({
    imageUrl,
    initialCrops = {},
    onSave,
    onCancel,
}: ImageCropperProps) {
    const [activeViewId, setActiveViewId] = useState<string>(
        IMAGE_CROP_CONFIGS[0].id,
    );
    const [crops, setCrops] = useState<ImageCropConfig>(initialCrops || {});

    const isCenterLockedHorizontalCrop = (viewId: string) =>
        viewId === 'home-card';

    const getDefaultCrop = (viewId: string, imgAspect: number): ImageCrop => {
        const config = IMAGE_CROP_CONFIGS.find((c) => c.id === viewId);

        if (!config || !Number.isFinite(imgAspect) || imgAspect <= 0) {
            return {
                x: 10,
                y: 10,
                width: 80,
                height: 80,
                scale: 1,
            };
        }

        const targetAspect = config.aspectRatio;

        if (isCenterLockedHorizontalCrop(viewId)) {
            let width = 85;
            let height = width * (imgAspect / targetAspect);

            if (height > 85) {
                height = 85;
                width = height * (targetAspect / imgAspect);
            }

            const x = (100 - width) / 2;
            const y = (100 - height) / 2;

            return {
                x,
                y,
                width,
                height,
                scale: 1,
            };
        }

        let width = 80;
        let height = width * (imgAspect / targetAspect);

        if (height > 90) {
            height = 80;
            width = height * (targetAspect / imgAspect);
        }

        const x = (100 - width) / 2;
        const y = (100 - height) / 2;

        return {
            x,
            y,
            width,
            height,
            scale: 1,
        };
    };

    // Source of truth is 'crops'. currentCrop is derived.
    const cropBox: ImageCrop = isValidCrop(
        crops[activeViewId] as Partial<ImageCrop> | undefined,
    )
        ? (crops[activeViewId] as ImageCrop)
        : {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              scale: 1,
          };

    const setCropBox = (newBox: ImageCrop, viewId: string = activeViewId) => {
        setCrops((prev) => {
            const currentBox = prev[viewId] as ImageCrop | undefined;

            if (currentBox && areCropsEqual(currentBox, newBox)) {
                return prev;
            }

            return {
                ...prev,
                [viewId]: newBox,
            };
        });
    };

    // Container and image refs to calculate positions
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Drag state
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const cropStartRef = useRef<ImageCrop | null>(null);
    const draggingRef = useRef<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;

        if (!naturalWidth || !naturalHeight) {
            return;
        }

        const imgAspect = naturalWidth / naturalHeight;

        setCrops((currentCrops) => {
            const activeCrop = currentCrops[activeViewId] as
                | Partial<ImageCrop>
                | undefined;

            if (!isValidCrop(activeCrop)) {
                return {
                    ...currentCrops,
                    [activeViewId]: getDefaultCrop(activeViewId, imgAspect),
                };
            }
            return currentCrops;
        });
    };

    const resetCrop = (viewId: string, imgAspect: number) => {
        if (!Number.isFinite(imgAspect) || imgAspect <= 0) {
            return;
        }

        const config = IMAGE_CROP_CONFIGS.find((c) => c.id === viewId);
        if (!config) return;

        setCropBox(getDefaultCrop(viewId, imgAspect), viewId);
    };

    const getClientPos = (
        e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
    ) => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return {
            x: (e as MouseEvent | React.MouseEvent).clientX,
            y: (e as MouseEvent | React.MouseEvent).clientY,
        };
    };

    const handleDragStart =
        (type: 'move' | 'nw' | 'ne' | 'sw' | 'se') =>
        (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();

            draggingRef.current = type;
            const pos = getClientPos(e);
            dragStartRef.current = pos;
            cropStartRef.current = { ...cropBox };

            window.addEventListener(
                'mousemove',
                handleDragMove as unknown as EventListener,
            );
            window.addEventListener(
                'mouseup',
                handleDragEnd as unknown as EventListener,
            );
            window.addEventListener(
                'touchmove',
                handleDragMove as unknown as EventListener,
                {
                    passive: false,
                },
            );
            window.addEventListener(
                'touchend',
                handleDragEnd as unknown as EventListener,
            );
        };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (
            !draggingRef.current ||
            !dragStartRef.current ||
            !cropStartRef.current ||
            !containerRef.current ||
            !imageRef.current
        )
            return;

        const pos = getClientPos(e);
        const dxPx = pos.x - dragStartRef.current.x;
        const dyPx = pos.y - dragStartRef.current.y;

        const containerRect = containerRef.current.getBoundingClientRect();
        // Convert px delta to % delta
        const dx = (dxPx / containerRect.width) * 100;
        const dy = (dyPx / containerRect.height) * 100;

        const start = cropStartRef.current;
        const newCrop = { ...start };

        const config = IMAGE_CROP_CONFIGS.find((c) => c.id === activeViewId);
        const targetAspect = config?.aspectRatio || 1;
        const imgAspect =
            imageRef.current.naturalWidth / imageRef.current.naturalHeight;

        const aspectFactor = imgAspect / targetAspect;
        const isCenterLocked = isCenterLockedHorizontalCrop(activeViewId);

        if (draggingRef.current === 'move') {
            if (isCenterLocked) {
                newCrop.x = Math.max(
                    0,
                    Math.min(100 - start.width, start.x + dx),
                );
                newCrop.y = Math.max(
                    0,
                    Math.min(100 - start.height, start.y + dy),
                );
                setCropBox(newCrop);
                return;
            }
            newCrop.x = Math.max(0, Math.min(100 - start.width, start.x + dx));
            newCrop.y = Math.max(0, Math.min(100 - start.height, start.y + dy));
        } else if (draggingRef.current === 'se') {
            if (isCenterLocked) {
                const centerX = start.x + start.width / 2;
                const centerY = start.y + start.height / 2;

                let width = start.width + dx * 2;

                const maxWidthByX =
                    2 * Math.min(centerX, Math.max(0, 100 - centerX));
                const maxHeightByY =
                    2 * Math.min(centerY, Math.max(0, 100 - centerY));
                const maxWidthByY = maxHeightByY / aspectFactor;
                const maxAllowedWidth = Math.min(maxWidthByX, maxWidthByY);

                width = Math.max(10, Math.min(maxAllowedWidth, width));

                const height = width * aspectFactor;

                newCrop.width = width;
                newCrop.height = height;
                newCrop.x = centerX - width / 2;
                newCrop.y = centerY - height / 2;

                setCropBox(newCrop);
                return;
            }

            // Update width
            let w = start.width + dx;
            // Clamp width
            w = Math.max(10, Math.min(100 - start.x, w));
            let h = w * aspectFactor;

            // Clamp height
            if (start.y + h > 100) {
                h = 100 - start.y;
                w = h / aspectFactor;
            }

            newCrop.width = w;
            newCrop.height = h;
        }

        setCropBox(newCrop);
    };

    const handleDragEnd = () => {
        draggingRef.current = null;
        dragStartRef.current = null;
        cropStartRef.current = null;
        window.removeEventListener(
            'mousemove',
            handleDragMove as unknown as EventListener,
        );
        window.removeEventListener(
            'mouseup',
            handleDragEnd as unknown as EventListener,
        );
        window.removeEventListener(
            'touchmove',
            handleDragMove as unknown as EventListener,
        );
        window.removeEventListener(
            'touchend',
            handleDragEnd as unknown as EventListener,
        );
    };

    const handleSave = () => {
        onSave(crops);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">
                        Bild zuschneiden
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Sidebar / Controls */}
                    <div className="w-full md:w-64 bg-gray-50 p-4 border-r flex flex-col gap-4 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Ansicht wählen
                            </label>
                            {IMAGE_CROP_CONFIGS.map((config) => (
                                <button
                                    key={config.id}
                                    onClick={() => {
                                        setActiveViewId(config.id);
                                        // If no crop for this view yet, initialze it
                                        if (
                                            imageRef.current &&
                                            !isValidCrop(
                                                crops[config.id] as
                                                    | Partial<ImageCrop>
                                                    | undefined,
                                            )
                                        ) {
                                            const imgAspect =
                                                imageRef.current.naturalWidth /
                                                imageRef.current.naturalHeight;
                                            resetCrop(config.id, imgAspect);
                                        }
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                        activeViewId === config.id
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="font-medium">
                                        {config.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {config.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-4">
                                Ziehen Sie den Rahmen, um den Ausschnitt zu
                                verschieben. Nutzen Sie den Anfasspunkt unten
                                rechts, um die Größe zu ändern.
                            </p>
                            <button
                                onClick={() => {
                                    if (imageRef.current) {
                                        const imgAspect =
                                            imageRef.current.naturalWidth /
                                            imageRef.current.naturalHeight;
                                        resetCrop(activeViewId, imgAspect);
                                    }
                                }}
                                className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mb-2"
                            >
                                <ArrowCounterClockwise
                                    size={18}
                                    className="mr-2"
                                />
                                Zurücksetzen
                            </button>
                        </div>
                    </div>

                    {/* Editor Canvas */}
                    <div className="flex-1 bg-gray-900 relative flex items-center justify-center p-4 overflow-hidden select-none">
                        <div
                            ref={containerRef}
                            className="relative w-full max-w-full max-h-full flex items-center justify-center"
                            style={{ touchAction: 'none' }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imageRef}
                                src={imageUrl}
                                alt="Crop target"
                                className="max-w-full max-h-[70vh] object-contain pointer-events-none"
                                onLoad={handleImageLoad}
                                draggable={false}
                            />

                            {/* Overlay outside crop */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div
                                    className="absolute bg-black bg-opacity-60"
                                    style={{
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        height: `${cropBox.y}%`,
                                    }}
                                />
                                <div
                                    className="absolute bg-black bg-opacity-60"
                                    style={{
                                        left: 0,
                                        top: `${cropBox.y + cropBox.height}%`,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                />
                                <div
                                    className="absolute bg-black bg-opacity-60"
                                    style={{
                                        left: 0,
                                        top: `${cropBox.y}%`,
                                        width: `${cropBox.x}%`,
                                        height: `${cropBox.height}%`,
                                    }}
                                />
                                <div
                                    className="absolute bg-black bg-opacity-60"
                                    style={{
                                        right: 0,
                                        top: `${cropBox.y}%`,
                                        width: `${100 - (cropBox.x + cropBox.width)}%`,
                                        height: `${cropBox.height}%`,
                                    }}
                                />
                            </div>

                            {/* Crop Box */}
                            <div
                                className="absolute border-2 border-white shadow-crop cursor-move group"
                                style={{
                                    left: `${cropBox.x}%`,
                                    top: `${cropBox.y}%`,
                                    width: `${cropBox.width}%`,
                                    height: `${cropBox.height}%`,
                                    boxShadow:
                                        '0 0 0 1px rgba(0,0,0,0.5), 0 0 0 9999px rgba(0,0,0,0.5)',
                                }}
                                onMouseDown={handleDragStart('move')}
                                onTouchStart={handleDragStart('move')}
                            >
                                {/* Grid lines (rule of thirds) */}
                                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                                    <div className="border-r border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-r border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-r border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-r border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-b border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-r border-white/50 col-span-1 row-span-1"></div>
                                    <div className="border-r border-white/50 col-span-1 row-span-1"></div>
                                    <div className="col-span-1 row-span-1"></div>
                                </div>

                                {/* SE Handle */}
                                <div
                                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize z-10 hover:scale-125 transition-transform"
                                    onMouseDown={handleDragStart('se')}
                                    onTouchStart={handleDragStart('se')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center shadow-sm"
                    >
                        <Check className="mr-2" size={20} />
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
}
