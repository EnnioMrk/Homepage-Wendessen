import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidatePathSafe = revalidatePath;

export function revalidateTagSafe(tag: string) {
    // Cast to any to avoid type signature changes across Next.js versions.
    try {
        (revalidateTag as unknown as any)(tag);
    } catch (e) {
        // Swallow runtime errors to avoid breaking admin APIs; log for visibility.
        // eslint-disable-next-line no-console
        console.warn('revalidateTagSafe failed for', tag, e);
    }
}

export default {
    revalidatePathSafe,
    revalidateTagSafe,
};
