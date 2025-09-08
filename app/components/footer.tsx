'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-foreground">
                            © 2025 Ortsrat Wendessen
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="/kontakt/impressum"
                            className="text-foreground hover:text-gray-600 transition-colors"
                        >
                            Impressum
                        </Link>
                        <Link
                            href="/kontakt/datenschutz"
                            className="text-foreground hover:text-gray-600 transition-colors"
                        >
                            Datenschutz
                        </Link>
                        <Link
                            href="/kontakt/andreas-rink"
                            className="text-foreground hover:text-gray-600 transition-colors"
                        >
                            Kontakt
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
