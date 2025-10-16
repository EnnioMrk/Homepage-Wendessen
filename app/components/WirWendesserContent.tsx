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
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                                Wir Wendesser
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Die Menschen unserer Dorfgemeinschaft
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Vielfalt • Gemeinschaft • Zusammenhalt
                        </p>

                        {/* Decorative elements - hidden on mobile */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-400/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

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
                                        Einige von uns wollen wir künftig an dieser
                                        Stelle kurz vorstellen.
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

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                            <ImageSquare className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Foto
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Ein schönes Bild von Ihnen
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                            <NotePencil className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Text
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Ein paar Zeilen über Sie
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                            <UserPlus className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Gemeinschaft
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Teil unserer Vielfalt werden
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Values */}
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-blue-700 mb-6">
                                Was uns verbindet
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                        <Star className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-blue-800 mb-2">
                                        Vielfalt
                                    </h4>
                                    <p className="text-gray-600">
                                        Jeder bringt seine eigene Geschichte mit
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                        <Handshake className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-indigo-800 mb-2">
                                        Gemeinschaft
                                    </h4>
                                    <p className="text-gray-600">
                                        Zusammen sind wir stärker
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                        <Heart className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-purple-800 mb-2">
                                        Zusammenhalt
                                    </h4>
                                    <p className="text-gray-600">
                                        Wendessen ist unser gemeinsames Zuhause
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
