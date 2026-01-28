import { sql } from '@/lib/sql';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const layout = await sql`
            SELECT * FROM wendessen_layouts 
            WHERE is_active = true 
            LIMIT 1
        `;

        if (layout.length === 0) {
            return NextResponse.json({ layout: null });
        }

        return NextResponse.json({ layout: layout[0] });
    } catch (error) {
        console.error('Error fetching active wendessen layout:', error);
        return NextResponse.json(
            { error: 'Fehler beim Laden des Layouts' },
            { status: 500 }
        );
    }
}
