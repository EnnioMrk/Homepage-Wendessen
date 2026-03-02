import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidatePathSafe(path: string, type?: 'page' | 'layout') {
    try {
        revalidatePath(path, type);
    } catch (e) {
        console.warn('revalidatePathSafe failed for', path, e);
    }
}

export function revalidateTagSafe(tag: string) {
    try {
        revalidateTag(tag, 'max');
    } catch (e) {
        // Swallow runtime errors to avoid breaking admin APIs; log for visibility.
        console.warn('revalidateTagSafe failed for', tag, e);
    }
}

const revalidate = {
    revalidatePathSafe,
    revalidateTagSafe,
};

export default revalidate;
