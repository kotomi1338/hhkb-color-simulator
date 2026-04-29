import { Head, Link } from '@inertiajs/react';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { HHKB_PALETTE } from '@/constants/colors';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import { useKeyboardState } from '@/hooks/use-keyboard-state';
import { history } from '@/routes';

export default function Editor() {
    const { keyColors, setKeyColor } = useKeyboardState();
    const activeColor = HHKB_PALETTE.YUKI;

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
                    <KeyboardCanvas
                        layout={US_HHKB_LAYOUT}
                        keyColors={keyColors}
                        onKeyClick={(keyId) => setKeyColor(keyId, activeColor)}
                    />
                    {/* ColorPicker (Step 4) */}
                </main>
            </div>
        </>
    );
}
