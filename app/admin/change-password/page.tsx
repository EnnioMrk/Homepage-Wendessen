'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeSlash, CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr';

export default function ChangePasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
    });
    const router = useRouter();

    useEffect(() => {
        setPasswordStrength({
            minLength: newPassword.length >= 8,
            hasLower: /[a-z]/.test(newPassword),
            hasUpper: /[A-Z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
        });
    }, [newPassword]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwörter stimmen nicht überein');
            setIsLoading(false);
            return;
        }

        if (!Object.values(passwordStrength).every(Boolean)) {
            setError('Passwort erfüllt nicht alle Anforderungen');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Passwort konnte nicht geändert werden');
            }
        } catch {
            setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    const StrengthIndicator = ({ met, text }: { met: boolean; text: string }) => (
        <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
            {met ? (
                <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
            ) : (
                <XCircle className="w-4 h-4 mr-2" />
            )}
            {text}
        </div>
    );

    return (
        <div className="my-auto h-full bg-gray-50 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">
                    Passwort ändern
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Bitte legen Sie ein neues, sicheres Passwort fest
                </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Neues Passwort
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Neues Passwort"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Passwort bestätigen
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Passwort bestätigen"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password strength indicators */}
                        <div className="bg-gray-50 p-4 rounded-md space-y-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Passwort-Anforderungen:
                            </p>
                            <StrengthIndicator
                                met={passwordStrength.minLength}
                                text="Mindestens 8 Zeichen"
                            />
                            <StrengthIndicator
                                met={passwordStrength.hasLower}
                                text="Mindestens ein Kleinbuchstabe"
                            />
                            <StrengthIndicator
                                met={passwordStrength.hasUpper}
                                text="Mindestens ein Großbuchstabe"
                            />
                            <StrengthIndicator
                                met={passwordStrength.hasNumber}
                                text="Mindestens eine Zahl"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !Object.values(passwordStrength).every(Boolean)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Wird geändert...' : 'Passwort ändern'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
