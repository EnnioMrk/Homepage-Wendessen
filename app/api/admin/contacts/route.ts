import { NextRequest, NextResponse } from 'next/server';
import { getContacts, createContact, searchContacts } from '@/lib/database/contacts';
import { withPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
    return withPermission('contacts.view', async () => {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        const contacts = query
            ? await searchContacts(query)
            : await getContacts();

        return NextResponse.json({ contacts });
    });
}

export async function POST(request: NextRequest) {
    return withPermission('contacts.create', async () => {
        const data = await request.json();
        // Basic validation could be done here if needed
        const contact = await createContact(data);
        return NextResponse.json({ contact });
    });
}
