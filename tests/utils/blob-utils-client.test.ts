import { describe, expect, test } from "bun:test";
import { isMinioUrl } from "../../lib/utils/blob-utils-client";

describe("blob-utils-client", () => {
    test("returns false for empty values", () => {
        expect(isMinioUrl(undefined)).toBe(false);
        expect(isMinioUrl(null)).toBe(false);
        expect(isMinioUrl("")).toBe(false);
    });

    test("detects local MinIO URLs", () => {
        expect(
            isMinioUrl("http://localhost:9000/admin-gallery/file.webp"),
        ).toBe(true);
        expect(isMinioUrl("http://127.0.0.1:9000/portraits/photo.jpg")).toBe(
            true,
        );
    });

    test("detects MinIO-like public host and port 9000 bucket paths", () => {
        expect(
            isMinioUrl(
                "http://146.59.235.98:9000/admin-gallery/1770902602002-file.webp",
            ),
        ).toBe(true);
        expect(isMinioUrl("https://example.com:9000/impressions/a.webp")).toBe(
            true,
        );
    });

    test("detects configured host from MINIO_ENDPOINT env", () => {
        const previousMinioEndpoint = process.env.MINIO_ENDPOINT;
        const previousEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
        const previousHostname = process.env.NEXT_PUBLIC_MINIO_HOSTNAME;

        process.env.MINIO_ENDPOINT = "http://cdn-storage.example.org:9000";
        process.env.NEXT_PUBLIC_MINIO_ENDPOINT =
            "https://cdn-storage.example.org:9000";
        process.env.NEXT_PUBLIC_MINIO_HOSTNAME = "";

        expect(
            isMinioUrl("https://cdn-storage.example.org/uploads/image.webp"),
        ).toBe(true);

        process.env.MINIO_ENDPOINT = previousMinioEndpoint;
        process.env.NEXT_PUBLIC_MINIO_ENDPOINT = previousEndpoint;
        process.env.NEXT_PUBLIC_MINIO_HOSTNAME = previousHostname;
    });

    test("returns false for non-minio URLs", () => {
        expect(isMinioUrl("https://example.com/images/photo.jpg")).toBe(false);
        expect(isMinioUrl("data:image/png;base64,abc123")).toBe(false);
    });
});
