import { Phone, User, Envelope } from '@phosphor-icons/react/dist/ssr';

interface ContactCardProps {
    name: string;
    role: string;
    phone?: string;
    email?: string;
    colorClassName?: string;
}

export default function ContactCard({
    name,
    role,
    phone,
    email,
    colorClassName = "text-red-600",
}: ContactCardProps) {
    return (
        <div className="bg-slate-50/50 rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between h-full transition-none">
            <div>
                <div className="flex items-center space-x-2 mb-3">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${colorClassName}`}>
                        {role}
                    </p>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                    {name}
                </h3>
            </div>

            <div className="space-y-4">
                {email && (
                    <div className="group">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">E-Mail</p>
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center text-slate-700 font-medium text-base md:text-lg transition-colors hover:text-red-600 truncate"
                        >
                            <Envelope className="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" weight="fill" />
                            <span className="truncate">{email}</span>
                        </a>
                    </div>
                )}

                {phone ? (
                    <div className="group">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Telefon</p>
                        <a
                            href={`tel:${phone.replace(/\s/g, '')}`}
                            className="flex items-center text-slate-700 font-medium text-base md:text-lg transition-colors hover:text-red-600"
                        >
                            <Phone className="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" weight="fill" />
                            {phone}
                        </a>
                    </div>
                ) : !email && (
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Kontakt</p>
                        <div className="flex items-center text-slate-500 italic text-sm">
                            <User className="w-5 h-5 mr-3 text-slate-300" />
                            Keine Kontaktdaten angegeben
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
