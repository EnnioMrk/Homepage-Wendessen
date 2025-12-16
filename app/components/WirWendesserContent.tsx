'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Buildings,
    Bank,
    BookOpen,
    ImageSquare,
    NotePencil,
    UserPlus,
    Camera,
    Star,
    Handshake,
    Heart,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import PortraitSubmissionModal from '@/app/components/PortraitSubmissionModal';
import PageHeader from '@/app/components/layout/PageHeader';

interface ApprovedPortrait {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    submittedAt: string;
}

export default function WirWendesserContent() {
    const [showPortraitModal, setShowPortraitModal] = useState(false);
    const [approvedPortraits, setApprovedPortraits] = useState<
        ApprovedPortrait[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadApprovedPortraits = async () => {
            try {
                const response = await fetch('/api/portraits/approved');
                if (response.ok) {
                    const data = await response.json();
                    setApprovedPortraits(data);
                }
            } catch (error) {
                console.error('Error loading approved portraits:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadApprovedPortraits();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-x-hidden">
            <PageHeader
                title="Wir Wendesser"
                subtitle="Die Menschen unserer Dorfgemeinschaft"
                icon={<Users />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="green"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 overflow-x-hidden">
                <div className="max-w-5xl mx-auto w-full">
                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Unsere wachsende Gemeinschaft
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            1100 Menschen, die Wendessen zu dem machen, was es
                            ist
                        </p>
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Wendessen wächst
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                                    <Users className="w-6 h-6 mr-3" />
                                    Aktuelle Einwohnerzahl
                                </h4>
                                <p className="text-lg">
                                    In Wendessen leben aktuell rund{' '}
                                    <strong>1100 Menschen</strong> - und wir
                                    werden immer mehr.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                                        <Buildings className="w-5 h-5 mr-2" />
                                        Leipziger Allee
                                    </h4>
                                    <p className="text-gray-700">
                                        An der Leipziger Allee entsteht aktuell
                                        neben dem ehemaligen Hotel Gala ein
                                        Mehrfamilienhaus.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                                    <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                                        <Bank className="w-5 h-5 mr-2" />
                                        Neues Baugebiet
                                    </h4>
                                    <p className="text-gray-700">
                                        Im Baugebiet neben der Bahn wird es ab
                                        2024 Platz für fast{' '}
                                        <strong>200 Neu-Wendesser</strong> und{' '}
                                        <strong>Neu-Wendesserinnen</strong>{' '}
                                        geben.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portrait Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Gesichter unserer Gemeinschaft
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Kurzportraits, die die Vielfalt unserer
                                Dorfgemeinschaft deutlich machen
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Wer sind wir?
                                </h3>
                                <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-6"></div>
                            </div>

                            <div className="space-y-6 text-gray-700 leading-relaxed text-center">
                                {approvedPortraits.length === 0 && (
                                    <p className="text-lg">
                                        Einige von uns wollen wir künftig an
                                        dieser Stelle kurz vorstellen.
                                        <strong>
                                            {' '}
                                            Wer sind sie, was bewegt sie, was
                                            wünschen sie sich?
                                        </strong>
                                    </p>
                                )}

                                {/* Approved Portraits Display */}
                                {isLoading ? (
                                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-200 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">
                                            Lade Portraits...
                                        </p>
                                    </div>
                                ) : approvedPortraits.length > 0 ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                            {approvedPortraits.map(
                                                (portrait) => (
                                                    <div
                                                        key={portrait.id}
                                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-amber-100 w-full min-w-0"
                                                    >
                                                        <div className="aspect-square relative">
                                                            <Image
                                                                src={
                                                                    portrait.imageUrl
                                                                }
                                                                alt={`Portrait von ${portrait.name}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-6">
                                                            <h5 className="text-xl font-bold text-amber-800 mb-3 break-words">
                                                                {portrait.name}
                                                            </h5>
                                                            <p className="text-gray-700 leading-relaxed break-words">
                                                                {
                                                                    portrait.description
                                                                }
                                                            </p>
                                                            <div className="mt-4 text-xs text-gray-500">
                                                                {new Date(
                                                                    portrait.submittedAt
                                                                ).toLocaleDateString(
                                                                    'de-DE',
                                                                    {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-200">
                                        <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 mr-3" />
                                            Portraits in Vorbereitung
                                        </h4>
                                        <p className="text-gray-700 text-center">
                                            Seien Sie der Erste! Teilen Sie Ihr
                                            Portrait mit der Dorfgemeinschaft.
                                            Ihre Geschichte macht Wendessen zu
                                            dem besonderen Ort, der es ist.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-green-700 mb-6">
                                Stellen Sie sich vor!
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-8"></div>

                            <div className="max-w-3xl mx-auto">
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    Wenn auch Sie Interesse haben, sich hier
                                    vorzustellen, dann teilen Sie doch einfach
                                    ein Foto mit ein paar Textzeilen mit uns:
                                </p>

                                <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-green-300 shadow-lg">
                                    <button
                                        onClick={() =>
                                            setShowPortraitModal(true)
                                        }
                                        className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 group hover:scale-105 transition-transform"
                                    >
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <div className="text-base sm:text-lg md:text-xl font-bold text-green-600 group-hover:text-green-800 transition-colors">
                                                Portrait einreichen
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Foto und Geschichte teilen
                                            </div>
                                        </div>
                                    </button>
                                    <p className="text-gray-600 text-center">
                                        Teilen Sie Ihr Foto und Ihre Geschichte
                                        mit der Dorfgemeinschaft!
                                    </p>
                                </div>

                                
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>

            {/* Portrait Submission Modal */}
            <PortraitSubmissionModal
                isOpen={showPortraitModal}
                onClose={() => setShowPortraitModal(false)}
                onSuccess={() => {
                    setShowPortraitModal(false);
                    // Note: Portraits need admin approval before appearing
                    // refreshPortraits(); // Uncomment when we want immediate display
                }}
            />
        </div>
    );
}
