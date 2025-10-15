import AddToExistingForm from './AddToExistingForm';

export const metadata = {
    title: 'Fotos hinzufügen - Wendessen',
    description: 'Fügen Sie weitere Fotos zu Ihrer bestehenden Einreichung hinzu',
};

export default function AddToExistingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <AddToExistingForm />
                </div>
            </div>
        </div>
    );
}
