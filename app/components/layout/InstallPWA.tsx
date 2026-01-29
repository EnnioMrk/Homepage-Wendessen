'use client';

import { useState, useEffect } from 'react';
import { DownloadSimple, Share, PlusSquare } from '@phosphor-icons/react/dist/ssr';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
    const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIosInstructions, setShowIosInstructions] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setPromptInstall(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if on iOS
        const userAgent = window.navigator.userAgent;
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window);
        
        // Check if already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
            (navigator as Navigator & { standalone?: boolean }).standalone;
        
        // Wrap state updates in a function to avoid synchronous setState warnings
        const updateClientStatus = async () => {
            await Promise.resolve();
            setIsIOS(isIOSDevice);
            setIsStandalone(!!isStandaloneMode);
        };
        
        updateClientStatus();
        
        // Register SW ensuring it's available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW reg failed', err));
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt: React.MouseEvent) => {
        evt.preventDefault();
        if (promptInstall) {
            promptInstall.prompt();
        } else if (isIOS) {
            setShowIosInstructions(!showIosInstructions);
        }
    };

    if (isStandalone) {
        return null; 
    }

    if (!promptInstall && !isIOS) {
        return null;
    }

    return (
        <div className="relative">
            <button 
                className="flex items-center gap-2 text-foreground hover:text-gray-600 transition-colors text-sm"
                onClick={onClick}
                aria-label="App installieren"
                title="Als App installieren"
            >
                <DownloadSimple className="w-4 h-4" />
                <span>App installieren</span>
            </button>

            {/* iOS Instructions Popover */}
            {showIosInstructions && isIOS && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 w-64 bg-white shadow-xl rounded-xl border border-gray-200 z-50 text-sm text-gray-700 animate-in fade-in slide-in-from-bottom-2">
                    <div className="relative">
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45 transform"></div>
                        <h4 className="mb-2 font-bold text-gray-900">Installation auf iOS</h4>
                        <ol className="space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold">1</span>
                                <span>Tippen Sie auf <Share className="inline w-4 h-4 mx-1" weight="bold" /> Teilen</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold">2</span>
                                <span>Wählen Sie <PlusSquare className="inline w-4 h-4 mx-1" weight="bold" /> &quot;Zum Home-Bildschirm&quot;</span>
                            </li>
                        </ol>
                        <button 
                            onClick={() => setShowIosInstructions(false)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
