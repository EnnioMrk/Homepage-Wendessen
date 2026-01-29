'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

interface ImageData {
    imageUrl: string;
    imageMimeType?: string;
}

interface SharedGalleryImageContextValue {
    getImageUrl: (imageId: string) => string | null;
    requestImage: (imageId: string, onLoad?: (imageUrl: string) => void) => void;
    isLoading: (imageId: string) => boolean;
    hasError: (imageId: string) => boolean;
}

const SharedGalleryImageContext = createContext<SharedGalleryImageContextValue | null>(null);

const BATCH_DELAY_MS = 50; // Wait to collect multiple requests before batching
const BATCH_SIZE = 50; // Max images per request

export function SharedGalleryImageProvider({ children }: { children: ReactNode }) {
    const [imageCache, setImageCache] = useState<Map<string, ImageData>>(new Map());
    const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set());
    const [errorSet, setErrorSet] = useState<Set<string>>(new Set());

    const pendingRequests = useRef<Set<string>>(new Set());
    const callbacks = useRef<Map<string, ((imageUrl: string) => void)[]>>(new Map());
    const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchBatch = useCallback(async (imageIds: string[]) => {
        if (imageIds.length === 0) return;

        // Mark all as loading
        setLoadingSet(prev => {
            const next = new Set(prev);
            imageIds.forEach(id => next.add(id));
            return next;
        });

        try {
            const response = await fetch('/api/admin/shared-gallery/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageIds }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();
            const images: Record<string, ImageData> = data.images || {};

            // Update cache with fetched images
            setImageCache(prev => {
                const next = new Map(prev);
                for (const [id, imageData] of Object.entries(images)) {
                    next.set(id, imageData);
                }
                return next;
            });

            // Mark missing images as errors
            const fetchedIds = new Set(Object.keys(images));
            const missingIds = imageIds.filter(id => !fetchedIds.has(id));

            if (missingIds.length > 0) {
                setErrorSet(prev => {
                    const next = new Set(prev);
                    missingIds.forEach(id => next.add(id));
                    return next;
                });
            }

            // Call callbacks for successfully loaded images
            for (const [id, imageData] of Object.entries(images)) {
                const cbs = callbacks.current.get(id);
                if (cbs) {
                    cbs.forEach(cb => cb(imageData.imageUrl));
                    callbacks.current.delete(id);
                }
            }
        } catch (error) {
            console.error('Error fetching batch images:', error);
            // Mark all as error
            setErrorSet(prev => {
                const next = new Set(prev);
                imageIds.forEach(id => next.add(id));
                return next;
            });
        } finally {
            // Remove from loading
            setLoadingSet(prev => {
                const next = new Set(prev);
                imageIds.forEach(id => next.delete(id));
                return next;
            });
        }
    }, []);

    const processPendingRequests = useCallback(() => {
        const ids = Array.from(pendingRequests.current);
        pendingRequests.current.clear();

        if (ids.length === 0) return;

        // Split into batches
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const batch = ids.slice(i, i + BATCH_SIZE);
            fetchBatch(batch);
        }
    }, [fetchBatch]);

    const requestImage = useCallback((imageId: string, onLoad?: (imageUrl: string) => void) => {
        // If already cached, call callback immediately
        const cached = imageCache.get(imageId);
        if (cached) {
            if (onLoad) onLoad(cached.imageUrl);
            return;
        }

        // If already loading or errored, just add callback
        if (loadingSet.has(imageId) || errorSet.has(imageId)) {
            if (onLoad && !errorSet.has(imageId)) {
                const existing = callbacks.current.get(imageId) || [];
                callbacks.current.set(imageId, [...existing, onLoad]);
            }
            return;
        }

        // Store callback
        if (onLoad) {
            const existing = callbacks.current.get(imageId) || [];
            callbacks.current.set(imageId, [...existing, onLoad]);
        }

        // Add to pending requests
        pendingRequests.current.add(imageId);

        // Schedule batch processing
        if (batchTimeoutRef.current) {
            clearTimeout(batchTimeoutRef.current);
        }
        batchTimeoutRef.current = setTimeout(processPendingRequests, BATCH_DELAY_MS);
    }, [imageCache, loadingSet, errorSet, processPendingRequests]);

    const getImageUrl = useCallback((imageId: string): string | null => {
        return imageCache.get(imageId)?.imageUrl || null;
    }, [imageCache]);

    const isLoading = useCallback((imageId: string): boolean => {
        return loadingSet.has(imageId) || pendingRequests.current.has(imageId);
    }, [loadingSet]);

    const hasError = useCallback((imageId: string): boolean => {
        return errorSet.has(imageId);
    }, [errorSet]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (batchTimeoutRef.current) {
                clearTimeout(batchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <SharedGalleryImageContext.Provider
            value={{ getImageUrl, requestImage, isLoading, hasError }}
        >
            {children}
        </SharedGalleryImageContext.Provider>
    );
}

export function useSharedGalleryImage(imageId: string, onLoad?: (imageUrl: string) => void) {
    const context = useContext(SharedGalleryImageContext);
    const onLoadRef = useRef(onLoad);

    useEffect(() => {
        onLoadRef.current = onLoad;
    }, [onLoad]);

    // Fallback for when context is not available (backwards compatibility)
    const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
    const [fallbackLoading, setFallbackLoading] = useState(false);
    const [fallbackError, setFallbackError] = useState(false);

    useEffect(() => {
        if (context) {
            context.requestImage(imageId, onLoadRef.current);
        } else {
            // Fallback to individual fetch
            let mounted = true;

            // Use an async wrapper to avoid synchronous setState during render
            const startFetch = async () => {
                // Ensure this runs in the next tick to avoid React 19 warnings
                await Promise.resolve();
                if (!mounted) return;
                
                setFallbackLoading(true);
                try {
                    const res = await fetch(`/api/admin/shared-gallery/image/${imageId}`);
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    if (mounted) {
                        setFallbackUrl(data.imageUrl);
                        setFallbackLoading(false);
                        if (onLoadRef.current) onLoadRef.current(data.imageUrl);
                    }
                } catch {
                    if (mounted) {
                        setFallbackError(true);
                        setFallbackLoading(false);
                    }
                }
            };

            startFetch();

            return () => {
                mounted = false;
            };
        }
        return undefined;
    }, [imageId, context]);

    if (context) {
        return {
            imageUrl: context.getImageUrl(imageId),
            loading: context.isLoading(imageId) && !context.getImageUrl(imageId),
            error: context.hasError(imageId),
        };
    }

    return {
        imageUrl: fallbackUrl,
        loading: fallbackLoading,
        error: fallbackError,
    };
}
