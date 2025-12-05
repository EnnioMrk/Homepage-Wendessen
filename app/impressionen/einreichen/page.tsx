import SharedGallerySubmissionForm from './SharedGallerySubmissionForm';
import { Camera } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/PageHeader';

export const metadata = {
    title: 'Fotos einreichen - Impressionen - Wendessen',
    description: 'Teilen Sie Ihre Fotos aus Wendessen mit der Gemeinschaft',
};

export default function ImpessionenEinreichenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Fotos einreichen"
                subtitle="Teilen Sie Ihre schönsten Momente aus Wendessen"
                icon={<Camera />}
                color="purple"
            />

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
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">
                                        1
                                    </span>
                                    <span>
                                        Wählen Sie ein oder mehrere Fotos aus,
                                        die Sie mit der Gemeinschaft teilen
                                        möchten
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">
                                        2
                                    </span>
                                    <span>
                                        Geben Sie für jedes Foto einen Titel und
                                        optional eine Beschreibung ein
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">
                                        3
                                    </span>
                                    <span>
                                        Ihre Einreichungen werden von unserem
                                        Team geprüft
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-bold text-sm mr-3 mt-0.5 flex-shrink-0">
                                        4
                                    </span>
                                    <span>
                                        Nach der Freigabe erscheinen Ihre Fotos
                                        in unserer Impressionen-Galerie
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Hinweis:</strong> Bitte stellen Sie
                                sicher, dass Sie die Rechte an den hochgeladenen
                                Fotos besitzen und dass keine Personen ohne
                                deren Zustimmung abgebildet sind.
                            </p>
                        </div>
                    </div>

                    <SharedGallerySubmissionForm />
                </div>
            </div>
        </div>
    );
}
