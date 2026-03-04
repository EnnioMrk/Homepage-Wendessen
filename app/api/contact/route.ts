import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

function sanitizeHeaderValue(value: string): string {
    return value.replace(/[\r\n"]/g, ' ').trim();
}

function escapeDisplayName(value: string): string {
    return sanitizeHeaderValue(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function getFormValue(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') ?? '';

        let email = '';
        let vorname = '';
        let nachname = '';
        let telefon = '';
        let adresse = '';
        let betreff = '';
        let nachricht = '';
        let datenschutz = false;

        if (contentType.includes('application/json')) {
            const body = (await request.json()) as Record<string, unknown>;
            email = String(body.email ?? '').trim();
            vorname = String(body.vorname ?? '').trim();
            nachname = String(body.nachname ?? '').trim();
            telefon = String(body.telefon ?? '').trim();
            adresse = String(body.adresse ?? '').trim();
            betreff = String(body.betreff ?? '').trim();
            nachricht = String(body.nachricht ?? '').trim();
            datenschutz = Boolean(body.datenschutz);
        } else {
            const formData = await request.formData();
            email = getFormValue(formData, 'email');
            vorname = getFormValue(formData, 'vorname');
            nachname = getFormValue(formData, 'nachname');
            telefon = getFormValue(formData, 'telefon');
            adresse = getFormValue(formData, 'adresse');
            betreff = getFormValue(formData, 'betreff');
            nachricht = getFormValue(formData, 'nachricht');
            datenschutz = formData.get('datenschutz') === 'on';
        }

        if (!email || !vorname || !nachname || !betreff || !nachricht || !datenschutz) {
            return NextResponse.json(
                { error: 'Bitte alle Pflichtfelder ausfüllen.' },
                { status: 400 }
            );
        }

        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = Number(process.env.SMTP_PORT ?? 587);
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === 'true';
        const toEmail = process.env.CONTACT_TO_EMAIL ?? 'info@wendessen.de';
        const fromEmail = process.env.CONTACT_FROM_EMAIL ?? smtpUser;

        const missingVars = [
            !smtpHost ? 'SMTP_HOST' : null,
            !smtpUser ? 'SMTP_USER' : null,
            !smtpPass ? 'SMTP_PASS' : null,
            !fromEmail ? 'CONTACT_FROM_EMAIL|SMTP_USER' : null,
        ].filter(Boolean);

        if (missingVars.length > 0) {
            return NextResponse.json(
                {
                    error: `E-Mail-Versand ist nicht konfiguriert. Fehlend: ${missingVars.join(', ')}`,
                },
                { status: 500 }
            );
        }

        const secure = smtpPort === 465;
        const senderName = `${vorname} ${nachname}`.trim();
        const safeDisplayName = escapeDisplayName(senderName || 'Kontaktformular');
        const safeEmail = sanitizeHeaderValue(email);

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: !allowSelfSigned,
            },
        });

        await transporter.sendMail({
            from: `"${safeDisplayName}" <${fromEmail}>`,
            to: toEmail,
            replyTo: `"${safeDisplayName}" <${safeEmail}>`,
            subject: `[Kontaktformular] ${betreff}`,
            text: [
                `Name: ${vorname} ${nachname}`,
                `E-Mail: ${email}`,
                `Telefon: ${telefon || '-'}`,
                `Adresse: ${adresse || '-'}`,
                '',
                'Nachricht:',
                nachricht,
            ].join('\n'),
        });

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error sending contact form mail:', error);
        return NextResponse.json(
            { error: 'Fehler beim Senden der Nachricht.' },
            { status: 500 }
        );
    }
}