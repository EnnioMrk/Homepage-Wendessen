'use client';

import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border py-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Image
                    src="/images/Logo-Waldorf.png"
                    alt="Waldorf Logo"
                    width={70}
                    height={35}
                />

                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Copyright
                </p>

                <div className="flex items-center gap-2">
                    <Facebook
                        size={18}
                        className="text-foreground hover:text-accent-dark transition-colors cursor-pointer"
                    />
                    <Instagram
                        size={18}
                        className="text-foreground hover:text-accent-dark transition-colors cursor-pointer"
                    />
                    <Twitter
                        size={18}
                        className="text-foreground hover:text-accent-dark transition-colors cursor-pointer"
                    />
                </div>
            </div>
        </footer>
    );
}
