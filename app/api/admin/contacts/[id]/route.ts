import { NextRequest, NextResponse } from 'next/server';
import { getContactById, updateContact, deleteContact } from '@/lib/database/contacts';
import { withPermission } from '@/lib/permissions';
import { revalidatePathSafe, revalidateTagSafe } from '@/lib/revalidate';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    return withPermission('contacts.view', async () => {
        const id = parseInt(idStr);
        const contact = await getContactById(id);
        if (!contact) {
            return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
        }
        return NextResponse.json({ contact });
    });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    return withPermission('contacts.edit', async () => {
        const id = parseInt(idStr);
        const data = await request.json();
        const contact = await updateContact(id, data);

        // Revalidate caches
        revalidateTagSafe('contacts');
        revalidatePathSafe('/');

        return NextResponse.json({ contact });
    });
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    return withPermission('contacts.delete', async () => {
        const id = parseInt(idStr);
        await deleteContact(id);

        // Revalidate caches
        revalidateTagSafe('contacts');
        revalidatePathSafe('/');

        return NextResponse.json({ success: true });
    });
}
