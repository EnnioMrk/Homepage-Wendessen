import Image from 'next/image';
import Link from 'next/link';
import {
    Bell,
    ShieldCheck,
    DeviceMobile,
    WhatsappLogo,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'WhatsApp-Kanal - Wendessen',
    description:
        'Folgen Sie dem offiziellen WhatsApp-Kanal von Wendessen. Bleiben Sie informiert über aktuelle Ereignisse, Veranstaltungen und wichtige Informationen aus unserem Dorf.',
};

export default function WhatsAppPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="WhatsApp-Kanal"
                subtitle="Aktuelles aus Wendessen direkt auf Ihr Smartphone"
                icon={<WhatsappLogo />}
                color="green"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* QR Code Section - Immediately Visible */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-4xl p-8 sm:p-12 shadow-2xl mb-12 border-2 border-green-200">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3">
                                Kanal folgen
                            </h2>
                            <p className="text-lg text-gray-700">
                                Scannen Sie den QR-Code mit Ihrem Smartphone
                            </p>
                        </div>

                        <div className="flex justify-center mb-8">
                            {/* QR Code */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl">
                                <Image
                                    src="/svgs/whatsapp-qrcode.svg"
                                    alt="WhatsApp-Kanal QR-Code"
                                    width={280}
                                    height={280}
                                    className="w-64 h-64 sm:w-72 sm:h-72"
                                />
                            </div>
                        </div>

                        {/* Direct Link */}
                        <div className="text-center">
                            <a
                                href="https://whatsapp.com/channel/0029VaFPwF496H4KMB87my1z"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors shadow-lg"
                            >
                                Kanal direkt öffnen
                            </a>
                        </div>
                    </div>

                    {/* Benefits - Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Aktuelle Updates
                            </h3>
                            <p className="text-sm text-gray-600">
                                Wichtige Nachrichten und Veranstaltungen
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Offiziell
                            </h3>
                            <p className="text-sm text-gray-600">
                                Vom Ortsrat Wendessen betreut
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <DeviceMobile className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                Direkt aufs Handy
                            </h3>
                            <p className="text-sm text-gray-600">
                                Push-Benachrichtigungen erhalten
                            </p>
                        </div>
                    </div>

                    {/* Alternative Contact - Compact */}
                    <div className="text-center bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 shadow-md">
                        <p className="text-gray-700 mb-4 text-sm">
                            Weitere Kontaktmöglichkeiten
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/kontakt/formular"
                                className="inline-flex items-center px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Kontaktformular
                            </Link>
                            <Link
                                href="/kontakt/verzeichnis"
                                className="inline-flex items-center px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Kontaktverzeichnis
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
