import { NextResponse } from 'next/server';

/**
 * An authorization failure that the API must report as 401/403, not as a 500.
 * `requirePermission` throws it; route handlers translate it with
 * `apiAuthResponse` before their generic error branch.
 */
export class ApiAuthError extends Error {
    constructor(
        public readonly status: 401 | 403,
        message: string,
    ) {
        super(message);
        this.name = 'ApiAuthError';
    }
}

export function apiAuthResponse(error: unknown): NextResponse | null {
    if (error instanceof ApiAuthError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status },
        );
    }
    return null;
}
