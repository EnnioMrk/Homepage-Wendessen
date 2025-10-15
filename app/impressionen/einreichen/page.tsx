import SharedGallerySubmissionForm from './SharedGallerySubmissionForm';

export const metadata = {
    title: 'Fotos einreichen - Impressionen - Wendessen',
    description: 'Teilen Sie Ihre Fotos aus Wendessen mit der Gemeinschaft',
};

export default function ImpessionenEinreichenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 to-red-600/95"></div>
                
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                        Fotos einreichen
                    </h1>
                    <div className="w-32 h-2 bg-white mx-auto mb-6"></div>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                        Teilen Sie Ihre schönsten Momente aus Wendessen! Ob Dorffest, Landschaft oder besondere Ereignisse &ndash; wir freuen uns über Ihre Fotos.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                So funktioniert&apos;s
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">1</span>
                                    <span>Wählen Sie ein oder mehrere Fotos aus, die Sie mit der Gemeinschaft teilen möchten</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">2</span>
                                    <span>Geben Sie für jedes Foto einen Titel und optional eine Beschreibung ein</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">3</span>
                                    <span>Ihre Einreichungen werden von unserem Team geprüft</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">4</span>
                                    <span>Nach der Freigabe erscheinen Ihre Fotos in unserer Impressionen-Galerie</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Hinweis:</strong> Bitte stellen Sie sicher, dass Sie die Rechte an den hochgeladenen Fotos besitzen 
                                und dass keine Personen ohne deren Zustimmung abgebildet sind.
                            </p>
                        </div>
                    </div>

                    <SharedGallerySubmissionForm />
                </div>
            </div>
        </div>
    );
}
