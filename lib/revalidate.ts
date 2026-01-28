import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidatePathSafe = revalidatePath;

export function revalidateTagSafe(tag: string) {
    try {
        revalidateTag(tag, 'page');
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
