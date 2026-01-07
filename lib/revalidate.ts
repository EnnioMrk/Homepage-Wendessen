import { revalidatePath, revalidateTag } from 'next/cache';

export const revalidatePathSafe = revalidatePath;

export function revalidateTagSafe(tag: string) {
    // Cast to unknown then Function to avoid type signature changes across Next.js versions.
    try {
        (revalidateTag as unknown as (tag: string, type?: string) => void)(
            tag,
            'max'
        );
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
