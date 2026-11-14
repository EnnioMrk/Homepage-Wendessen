'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || isPending) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                startTransition(() => {
                    if (data.mustChangePassword) {
                        router.push('/admin/change-password');
                    } else {
                        router.push('/admin/dashboard');
                    }
                });
            } else {
                setError(data.error || 'Anmeldung fehlgeschlagen.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Verbindung fehlgeschlagen. Bitte erneut versuchen.');
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div>
                <div className="admin-login-card">
                    <p className="kicker">Redaktion</p>
                    <h1>Anmeldung am Register</h1>
                    <p className="lede">
                        Zugang für Ortsrat, Vereine und Redaktionsteam.
                    </p>

                    {error && (
                        <div className="notice notice--error" role="alert" style={{ marginBottom: 'var(--s4)' }}>
                            <strong>Nicht angemeldet</strong>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="form-grid" onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="username">Benutzername</label>
                            <input
                                id="username"
                                name="username"
                                className="input"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="password">Passwort</label>
                            <div style={{ display: 'flex', gap: 'var(--s2)' }}>
                                <input
                                    id="password"
                                    name="password"
                                    className="input"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={isLoading || isPending}
                        >
                            {isLoading || isPending
                                ? 'Wird geprüft …'
                                : 'Anmelden'}
                        </button>
                    </form>

                    <p className="small muted" style={{ marginTop: 'var(--s5)' }}>
                        Passwort vergessen? Die Redaktionsleitung kann es
                        zurücksetzen. <Link className="link" href="/">Zurück zur Startseite</Link>
                    </p>
                </div>

                <p
                    className="small muted"
                    style={{ marginTop: 'var(--s4)', textAlign: 'center' }}
                >
                    Wendessen · Dorfchronik seit 1170
                </p>
            </div>
        </div>
    );
}
