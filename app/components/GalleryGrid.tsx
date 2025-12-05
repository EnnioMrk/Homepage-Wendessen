'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageLightbox from './ImageLightbox';
import AddPhotosModal from './AddPhotosModal';

interface GalleryImage {
    id: string;
    imageUrl: string;
    description?: string;
    dateTaken?: Date;
    location?: string;
}

interface GalleryGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    images: GalleryImage[];
    submittedAt: Date;
    totalCount: number;
}

interface GalleryGridProps {
    groups: GalleryGroup[];
}

export default function GalleryGrid({ groups }: GalleryGridProps) {
    const [selectedImage, setSelectedImage] = useState<{
        submissionId: string;
        imageUrl: string;
        title: string;
        description?: string;
        submitterName?: string;
        submittedAt: Date;
        dateTaken?: Date;
        location?: string;
        filename?: string;
    } | null>(null);
    const [addPhotosGroup, setAddPhotosGroup] = useState<GalleryGroup | null>(
        null
    );
    const [showAuthorsPopup, setShowAuthorsPopup] = useState<string | null>(
        null
    );

    const gradients = [
        'from-purple-500 via-pink-500 to-red-500',
        'from-blue-500 via-cyan-500 to-teal-500',
        'from-orange-500 via-amber-500 to-yellow-500',
        'from-green-500 via-emerald-500 to-lime-500',
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-rose-500 via-pink-500 to-fuchsia-500',
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Unsere Galerie
                </h2>
                {groups.map((group, index) => {
                    const gradient = gradients[index % gradients.length];

                    return (
                        <div key={group.submissionGroupId} className="relative">
                            {/* Decorative gradient background */}
                            <div
                                className={`absolute -inset-4 bg-gradient-to-r ${gradient} rounded-3xl opacity-10 blur-2xl`}
                            ></div>

                            <div className="relative">
                                {/* Group Header with gradient accent */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-start gap-3 mb-3 flex-wrap">
                                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                                            {group.title}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setAddPhotosGroup(group)
                                            }
                                            className={`px-4 py-1.5 bg-gradient-to-r ${gradient} hover:opacity-90 text-white rounded-full font-medium text-sm transition-opacity flex items-center gap-2`}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Ergänzen
                                        </button>
                                    </div>
                                    {group.description && (
                                        <p className="text-lg text-gray-700 mb-3 max-w-3xl">
                                            {group.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="font-medium">
                                            {group.totalCount} Foto
                                            {group.totalCount !== 1 ? 's' : ''}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        {group.submitterNames.length > 0 && (
                                            <>
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <svg
                                                        className="w-4 h-4 text-gray-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    {group.submitterNames[0]}
                                                    {group.submitterNames
                                                        .length > 1 && (
                                                        <>
                                                            {' und '}
                                                            <button
                                                                onClick={() =>
                                                                    setShowAuthorsPopup(
                                                                        group.submissionGroupId
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-700 underline"
                                                            >
                                                                {group
                                                                    .submitterNames
                                                                    .length -
                                                                    1}{' '}
                                                                mehr
                                                            </button>
                                                        </>
                                                    )}
                                                </span>
                                                <span className="text-gray-400">
                                                    •
                                                </span>
                                            </>
                                        )}
                                        <span>
                                            {new Date(
                                                group.submittedAt
                                            ).toLocaleDateString('de-DE', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Group Images with staggered layout */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {group.images.map((photo, photoIndex) => (
                                        <div
                                            key={photo.id}
                                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                                            style={{
                                                animationDelay: `${
                                                    photoIndex * 100
                                                }ms`,
                                            }}
                                            onClick={() =>
                                                setSelectedImage({
                                                    submissionId: photo.id,
                                                    imageUrl: photo.imageUrl,
                                                    title: group.title,
                                                    description:
                                                        photo.description,
                                                    submitterName:
                                                        group.submitterNames[0],
                                                    submittedAt:
                                                        group.submittedAt,
                                                    dateTaken: photo.dateTaken,
                                                    location: photo.location,
                                                })
                                            }
                                        >
                                            {/* Gradient border effect */}
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm -z-10`}
                                            ></div>

                                            <div className="aspect-square relative overflow-hidden">
                                                <Image
                                                    src={photo.imageUrl}
                                                    alt={
                                                        photo.description ||
                                                        group.title
                                                    }
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />
                                                {/* Overlay gradient on hover */}
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                                                ></div>

                                                {/* Click hint on hover */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                                        <svg
                                                            className="w-6 h-6 text-gray-800"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            {photo.description && (
                                                <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                                                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                                                        {photo.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Separator line with gradient */}
                            {index < groups.length - 1 && (
                                <div className="mt-16">
                                    <div
                                        className={`h-1 w-full bg-gradient-to-r ${gradient} opacity-20 rounded-full`}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <ImageLightbox
                    submissionId={selectedImage.submissionId}
                    imageUrl={selectedImage.imageUrl}
                    title={selectedImage.title}
                    description={selectedImage.description}
                    submitterName={selectedImage.submitterName}
                    submittedAt={selectedImage.submittedAt}
                    dateTaken={selectedImage.dateTaken}
                    location={selectedImage.location}
                    filename={selectedImage.filename}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            {/* Add Photos Modal */}
            {addPhotosGroup && (
                <AddPhotosModal
                    group={addPhotosGroup}
                    onClose={() => setAddPhotosGroup(null)}
                    onSuccess={() => {
                        setAddPhotosGroup(null);
                        window.location.reload();
                    }}
                />
            )}

            {/* Authors Popup */}
            {showAuthorsPopup &&
                (() => {
                    const group = groups.find(
                        (g) => g.submissionGroupId === showAuthorsPopup
                    );
                    if (!group) return null;

                    return (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowAuthorsPopup(null)}
                        >
                            <div
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Autoren
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowAuthorsPopup(null)
                                        }
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {group.submitterNames.map((name, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="font-medium text-gray-900">
                                                {name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
        </>
    );
}
