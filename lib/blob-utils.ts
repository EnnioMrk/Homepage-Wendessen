// Custom Vercel Blob utilities to avoid undici dependency issues

interface BlobUploadResponse {
    url: string;
    pathname: string;
    contentType: string;
    contentDisposition: string;
}

export async function uploadToBlob(
    filename: string, 
    file: File, 
    options: { access: 'public'; addRandomSuffix?: boolean } = { access: 'public' }
): Promise<BlobUploadResponse> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }

    const formData = new FormData();
    formData.append('file', file);

    const finalFilename = options.addRandomSuffix 
        ? `${Date.now()}-${Math.random().toString(36).substring(2)}-${filename}`
        : filename;

    const response = await fetch(
        `https://blob.vercel-storage.com/${finalFilename}?access=${options.access}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            },
            body: file,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload to blob storage: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return {
        url: result.url,
        pathname: finalFilename,
        contentType: file.type,
        contentDisposition: `inline; filename="${filename}"`,
    };
}

export async function deleteFromBlob(url: string): Promise<void> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete from blob storage: ${response.status} ${errorText}`);
    }
}