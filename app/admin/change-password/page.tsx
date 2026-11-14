'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const strength = useMemo(
        () => ({
            minLength: newPassword.length >= 8,
            hasLower: /[a-z]/.test(newPassword),
            hasUpper: /[A-Z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
        }),
        [newPassword],
    );

    const allMet = Object.values(strength).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Die Passwörter stimmen nicht überein.');
            setIsLoading(false);
            return;
        }

        if (!allMet) {
            setError('Das Passwort erfüllt nicht alle Anforderungen.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                router.push('/admin/dashboard');
            } else {
                setError(
                    data.error || 'Das Passwort konnte nicht geändert werden.',
                );
            }
        } catch {
            setError('Netzwerkfehler. Bitte erneut versuchen.');
        } finally {
            setIsLoading(false);
        }
    };

    const rules: [boolean, string][] = [
        [strength.minLength, 'Mindestens 8 Zeichen'],
        [strength.hasLower, 'Ein Kleinbuchstabe'],
        [strength.hasUpper, 'Ein Großbuchstabe'],
        [strength.hasNumber, 'Eine Zahl'],
    ];

    return (
        <div className="admin-login">
            <div className="admin-login-card">
                <p className="kicker">Redaktion</p>
                <h1>Passwort ändern</h1>
                <p className="lede">
                    Das erste Passwort wurde vergeben. Legen Sie jetzt ein
                    eigenes fest.
                </p>

                {error && (
                    <div
                        className="notice notice--error"
                        role="alert"
                        style={{ marginBottom: 'var(--s4)' }}
                    >
                        <strong>Nicht geändert</strong>
                        <span>{error}</span>
                    </div>
                )}

                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="newPassword">Neues Passwort</label>
                        <div style={{ display: 'flex', gap: 'var(--s2)' }}>
                            <input
                                id="newPassword"
                                className="input"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn--quiet btn--sm"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-pressed={showPassword}
                                style={{ flex: 'none', minWidth: 92 }}
                            >
                                {showPassword ? 'Verbergen' : 'Zeigen'}
                            </button>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword">
                            Passwort wiederholen
                        </label>
                        <input
                            id="confirmPassword"
                            className="input"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            aria-invalid={
                                confirmPassword.length > 0 &&
                                confirmPassword !== newPassword
                                    ? 'true'
                                    : undefined
                            }
                        />
                        {confirmPassword.length > 0 &&
                            confirmPassword !== newPassword && (
                                <p className="error-text">
                                    Die Eingaben stimmen nicht überein.
                                </p>
                            )}
                    </div>

                    <ul
                        aria-label="Anforderungen an das Passwort"
                        style={{
                            display: 'grid',
                            gap: 4,
                            borderTop: 'var(--border) solid var(--rule)',
                            paddingTop: 'var(--s3)',
                        }}
                    >
                        {rules.map(([met, text]) => (
                            <li
                                key={text}
                                className="small"
                                style={{
                                    color: met
                                        ? 'var(--ok)'
                                        : 'var(--ink-muted)',
                                }}
                            >
                                {met ? '✓' : '·'} {text}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Wird gespeichert …' : 'Passwort speichern'}
                    </button>
                </form>
            </div>
        </div>
    );
}
