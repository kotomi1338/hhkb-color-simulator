import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/DesignController';
import { index as presentationIndex } from '@/actions/App/Http/Controllers/PresentationController';
import AuthControl from '@/components/auth-control';
import ColorPicker from '@/components/color-picker';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { HHKB_PALETTE } from '@/constants/colors';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import { useKeyboardState } from '@/hooks/use-keyboard-state';
import { generateRandomDesign } from '@/lib/random-design';
import { cn } from '@/lib/utils';
import { history } from '@/routes';
import type { Design } from '@/types';

type PaintMode = 'normal' | 'toggle';

export default function Editor({ design }: { design: Design | null }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';
    const { keyColors, setKeyColor, fillAll, fillRow, loadColors } =
        useKeyboardState();
    const [paintMode, setPaintMode] = useState<PaintMode>('normal');
    const [activeColor, setActiveColor] = useState<string>(HHKB_PALETTE.YUKI);
    const [secondaryColor, setSecondaryColor] = useState<string>(
        HHKB_PALETTE.YUKI,
    );
    const [hoveredKeyId, setHoveredKeyId] = useState<string | null>(null);
    const [showSaved, setShowSaved] = useState(false);
    const savedTimer = useRef<number | null>(null);

    useEffect(() => {
        if (design) {
            loadColors(design.colors);
        }
    }, [design, loadColors]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.code !== 'Space') return;
            if (e.target instanceof HTMLInputElement) return;
            if (!hoveredKeyId) return;
            e.preventDefault();
            applyColor(hoveredKeyId);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hoveredKeyId, paintMode, activeColor, secondaryColor, keyColors]);

    function applyColor(keyId: string) {
        if (paintMode === 'toggle') {
            const current = keyColors[keyId] ?? HHKB_PALETTE.YUKI;
            setKeyColor(
                keyId,
                current === activeColor ? secondaryColor : activeColor,
            );
        } else {
            setKeyColor(keyId, activeColor);
        }
    }

    function handleRandom() {
        loadColors(generateRandomDesign(US_HHKB_LAYOUT));
    }

    function handleSave() {
        const allColors = Object.fromEntries(
            US_HHKB_LAYOUT.map((key) => [
                key.id,
                keyColors[key.id] ?? HHKB_PALETTE.YUKI,
            ]),
        );
        router.post(
            store.url(),
            { layout_type: 'US_HHKB', colors: allColors },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowSaved(true);
                    if (savedTimer.current) {
                        window.clearTimeout(savedTimer.current);
                    }
                    savedTimer.current = window.setTimeout(
                        () => setShowSaved(false),
                        2000,
                    );
                },
            },
        );
    }

    return (
        <>
            <Head title="HHKB Color Simulator" />
            {showSaved && (
                <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
                    保存しました
                </div>
            )}
            <div className="flex min-h-screen flex-col bg-gray-100">
                <header className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
                    <h1 className="truncate text-base font-semibold text-gray-800 sm:text-lg">
                        HHKB Color Simulator
                    </h1>
                    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                        <Link
                            href={history.url()}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            History
                        </Link>
                        {isAdmin && (
                            <Link
                                href={presentationIndex.url()}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Presentation
                            </Link>
                        )}
                        <AuthControl />
                    </div>
                </header>

                <main className="flex w-full flex-1 flex-col items-center justify-center gap-6 p-4 sm:gap-8 sm:p-8">
                    <KeyboardCanvas
                        layout={US_HHKB_LAYOUT}
                        keyColors={keyColors}
                        onKeyClick={applyColor}
                        onKeyHover={setHoveredKeyId}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPaintMode('normal')}
                                className={cn(
                                    'rounded-md border px-3 py-1.5 text-xs transition-colors',
                                    paintMode === 'normal'
                                        ? 'border-gray-800 bg-gray-800 text-white'
                                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
                                )}
                            >
                                通常
                            </button>
                            <button
                                onClick={() => setPaintMode('toggle')}
                                className={cn(
                                    'rounded-md border px-3 py-1.5 text-xs transition-colors',
                                    paintMode === 'toggle'
                                        ? 'border-gray-800 bg-gray-800 text-white'
                                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
                                )}
                            >
                                トグル
                            </button>
                        </div>

                        {paintMode === 'toggle' ? (
                            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        1色目
                                    </span>
                                    <ColorPicker
                                        activeColor={activeColor}
                                        onColorSelect={setActiveColor}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        2色目
                                    </span>
                                    <ColorPicker
                                        activeColor={secondaryColor}
                                        onColorSelect={setSecondaryColor}
                                    />
                                </div>
                            </div>
                        ) : (
                            <ColorPicker
                                activeColor={activeColor}
                                onColorSelect={setActiveColor}
                            />
                        )}
                    </div>

                    <button
                        onClick={handleRandom}
                        className="rounded-full border border-pink-200 bg-pink-50 px-5 py-2 text-sm font-medium text-pink-500 hover:bg-pink-100"
                    >
                        🎲 おまかせ配色
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={() => fillAll(US_HHKB_LAYOUT, activeColor)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                        >
                            全キー
                        </button>
                        <span className="hidden h-4 w-px bg-gray-300 sm:block" />
                        {([0, 1, 2, 3, 4] as const).map((row) => (
                            <button
                                key={row}
                                onClick={() =>
                                    fillRow(US_HHKB_LAYOUT, row, activeColor)
                                }
                                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                            >
                                {row + 1}行目
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="rounded-md bg-gray-800 px-6 py-2 text-sm text-white hover:bg-gray-700"
                    >
                        このデザインを保存
                    </button>
                </main>
            </div>
        </>
    );
}
