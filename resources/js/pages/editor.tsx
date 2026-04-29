import { Head, Link } from '@inertiajs/react';
import { history } from '@/routes';

export default function Editor() {
    return (
        <>
            <Head title="HHKB Color Simulator" />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">HHKB Color Simulator</h1>
                    <Link href={history.url()} className="text-sm text-gray-500 hover:text-gray-700">
                        History
                    </Link>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
                    {/* KeyboardCanvas (Step 3) */}
                    {/* ColorPicker (Step 4) */}
                </main>
            </div>
        </>
    );
}
