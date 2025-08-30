'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
        </button>
    );
}
