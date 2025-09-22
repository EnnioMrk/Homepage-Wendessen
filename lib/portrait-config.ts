/**
 * Configuration for portrait submission system
 */

export const PORTRAIT_CONFIG = {
    /**
     * Maximum number of rejected portraits to keep in the database.
     * When this limit is exceeded during rejection, the oldest rejected portraits will be deleted.
     */
    MAX_REJECTED_PORTRAITS: 50,
    
    /**
     * Maximum file size for portrait uploads (in bytes)
     * Default: 5MB
     */
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    
    /**
     * Minimum description length required for portrait submissions
     */
    MIN_DESCRIPTION_LENGTH: 50,
    
    /**
     * Allowed image MIME types for portrait uploads
     */
    ALLOWED_IMAGE_TYPES: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
    ]
} as const;