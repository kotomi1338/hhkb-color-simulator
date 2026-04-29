import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ColorPicker from '@/components/color-picker';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { HHKB_PALETTE } from '@/constants/colors';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import { useKeyboardState } from '@/hooks/use-keyboard-state';
import { cn } from '@/lib/utils';
import { history } from '@/routes';
import { getDesignById, saveDesign } from '@/utils/storage';

type PaintMode = 'normal' | 'toggle';

export default function Editor() {
    const { keyColors, setKeyColor, fillAll, fillRow, loadColors } = useKeyboardState();
    const [paintMode, setPaintMode] = useState<PaintMode>('normal');
    const [activeColor, setActiveColor] = useState<string>(HHKB_PALETTE.YUKI);
    const [secondaryColor, setSecondaryColor] = useState<string>(HHKB_PALETTE.YUKI);
    const [hoveredKeyId, setHoveredKeyId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const designId = params.get('load');
        if (designId) {
            const design = getDesignById(designId);
            if (design) {
                loadColors(design.colors);
            }
        }
    }, []);

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
            setKeyColor(keyId, current === activeColor ? secondaryColor : activeColor);
        } else {
            setKeyColor(keyId, activeColor);
        }
    }

    function handleSave() {
        const allColors = Object.fromEntries(
            US_HHKB_LAYOUT.map((key) => [key.id, keyColors[key.id] ?? HHKB_PALETTE.YUKI]),
        );
        saveDesign(allColors);
    }

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
                        onKeyClick={applyColor}
                        onKeyHover={setHoveredKeyId}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPaintMode('normal')}
                                className={cn(
                                    'text-xs px-3 py-1.5 rounded-md border transition-colors',
                                    paintMode === 'normal'
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
                                )}
                            >
                                通常
                            </button>
                            <button
                                onClick={() => setPaintMode('toggle')}
                                className={cn(
                                    'text-xs px-3 py-1.5 rounded-md border transition-colors',
                                    paintMode === 'toggle'
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
                                )}
                            >
                                トグル
                            </button>
                        </div>

                        {paintMode === 'toggle' ? (
                            <div className="flex items-start gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500">1色目</span>
                                    <ColorPicker activeColor={activeColor} onColorSelect={setActiveColor} />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500">2色目</span>
                                    <ColorPicker activeColor={secondaryColor} onColorSelect={setSecondaryColor} />
                                </div>
                            </div>
                        ) : (
                            <ColorPicker activeColor={activeColor} onColorSelect={setActiveColor} />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fillAll(US_HHKB_LAYOUT, activeColor)}
                            className="text-xs text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50"
                        >
                            全キー
                        </button>
                        <span className="w-px h-4 bg-gray-300" />
                        {([0, 1, 2, 3, 4] as const).map((row) => (
                            <button
                                key={row}
                                onClick={() => fillRow(US_HHKB_LAYOUT, row, activeColor)}
                                className="text-xs text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50"
                            >
                                {row + 1}行目
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="bg-gray-800 text-white text-sm px-6 py-2 rounded-md hover:bg-gray-700"
                    >
                        このデザインを保存
                    </button>
                </main>
            </div>
        </>
    );
}
