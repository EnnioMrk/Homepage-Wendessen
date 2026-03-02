import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';

export async function GET() {
    await connection();
    try {
        const user = await getCurrentAdminUser();
        return NextResponse.json({
            authenticated: Boolean(user),
            user,
        });
    } catch (error) {
        console.error('Error determining admin status:', error);
        return NextResponse.json({ authenticated: false, user: null });
    }
}
