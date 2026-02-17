export interface CropConfig {
    id: string;
    label: string;
    aspectRatio: number; // width / height
    description?: string;
}

export const IMAGE_CROP_CONFIGS: CropConfig[] = [
    {
        id: 'popup',
        label: 'Detailansicht (Popup)',
        aspectRatio: 16 / 9,
        description: 'Wird im Detail-Modal angezeigt',
    },
    {
        id: 'card',
        label: 'Listenansicht (Karte)',
        aspectRatio: 3 / 1,
        // Approximating the wide banner look in the card list (h-32 w-full)
        // Since width varies, a wide ratio is safer to crop for.
        description: 'Wird in der "Nächste Termine" Liste angezeigt',
    },
    {
        id: 'home-card',
        label: 'Startseite (Karte)',
        aspectRatio: 2 / 3,
        description: 'Wird auf der Startseite angezeigt (Mitte bleibt im Fokus)',
    },
];

export const DEFAULT_CROP = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 1,
};
