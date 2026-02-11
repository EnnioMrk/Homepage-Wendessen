'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, UserPlus, X } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import PortraitSubmissionModal from '@/app/components/PortraitSubmissionModal';
import PageHeader from '@/app/components/layout/PageHeader';
import Modal from '@/app/components/ui/Modal';

interface ApprovedPortrait {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    submittedAt: string;
}

export default function WirWendesserContent() {
    const [showPortraitModal, setShowPortraitModal] = useState(false);
    const [selectedPortrait, setSelectedPortrait] =
        useState<ApprovedPortrait | null>(null);
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
                <div className="max-w-4xl mx-auto w-full">
                    {/* Intro Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12 border border-slate-100">
                        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                            <p>
                                Wendessen ist in den letzten Jahrzehnten durch
                                drei Baugebiete kontinuierlich gewachsen,
                                aktuell (Stand: Januar 2026) leben rund 1100
                                Menschen hier. Und wenn alles läuft wie seit
                                Jahren geplant, werden wir bald noch mehr sein -
                                das neue Baugebiet an der Leipziger Allee, wo
                                früher die alte Zuckerfabrik stand, wird Platz
                                für über 100 Neu-Wendesser bieten.
                            </p>
                            <p>
                                <strong>EINIGE</strong> unserer Mitbürgerinnen
                                und Mitbürger wollen wir an dieser Stelle mit
                                Kurzportraits vorstellen, als Gesichter unserer
                                Gemeinschaft. Ohne Anspruch auf Vollständigkeit
                                oder darauf, repräsentativ zu sein, versteht
                                sich.
                            </p>
                            <p className="font-semibold text-emerald-700 italic">
                                Wer sind sie, was machen sie, was bewegt sie,
                                was wünschen sie sich?
                            </p>
                        </div>
                    </div>

                    {/* Approved Portraits Display */}
                    <div className="mb-16">
                        {isLoading ? (
                            <div className="bg-white p-12 rounded-3xl shadow-lg text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    Lade Portraits...
                                </p>
                            </div>
                        ) : approvedPortraits.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                                {approvedPortraits.map((portrait) => (
                                    <div
                                        key={portrait.id}
                                        onClick={() =>
                                            setSelectedPortrait(portrait)
                                        }
                                        className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100 group cursor-pointer"
                                    >
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <Image
                                                src={portrait.imageUrl}
                                                alt={`Portrait von ${portrait.name}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h5 className="text-xl font-bold text-gray-900 mb-3 break-words">
                                                {portrait.name}
                                            </h5>
                                            <p className="text-gray-700 leading-relaxed break-words text-sm line-clamp-5">
                                                {portrait.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-3xl shadow-lg text-center border-2 border-dashed border-emerald-100">
                                <BookOpen className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                                <p className="text-gray-500 italic">
                                    Die ersten Portraits befinden sich in
                                    Vorbereitung.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Call to Action Section */}
                    <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-3xl font-bold mb-6">
                                Wir Wendesser
                            </h3>
                            <p className="text-lg text-emerald-50 mb-8 leading-relaxed">
                                Möchten auch Sie selbst hier vorkommen, etwas zu
                                Ihrer Person und ihrer Geschichte erzählen? Dann
                                schicken Sie uns doch einfach ein Foto und ein
                                paar Textzeilen:
                            </p>

                            <button
                                onClick={() => setShowPortraitModal(true)}
                                className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 gap-3"
                            >
                                <UserPlus className="w-6 h-6" />
                                <span>Portrait einreichen</span>
                            </button>

                            <p className="mt-8 text-sm text-emerald-100/70">
                                Hinweis zur Klarstellung: Ein Rechtsanspruch auf
                                Veröffentlichung des Beitrages besteht nicht.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Portrait Details Modal */}
            <Modal
                isOpen={!!selectedPortrait}
                onClose={() => setSelectedPortrait(null)}
                className="max-w-3xl w-full"
            >
                {selectedPortrait && (
                    <div className="bg-white px-6 pt-6 pb-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {selectedPortrait.name}
                            </h3>
                            <button
                                onClick={() => setSelectedPortrait(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Image */}
                        <div className="relative h-[25rem] aspect-square bg-gray-100 rounded-lg overflow-hidden mb-6 mx-auto border-[16px] border-white ring-2 ring-gray-100 shadow-lg">
                            <Image
                                src={selectedPortrait.imageUrl}
                                alt={`Portrait von ${selectedPortrait.name}`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {selectedPortrait.description}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Portrait Submission Modal */}
            <PortraitSubmissionModal
                isOpen={showPortraitModal}
                onClose={() => setShowPortraitModal(false)}
                onSuccess={() => {
                    setShowPortraitModal(false);
                }}
            />
        </div>
    );
}
