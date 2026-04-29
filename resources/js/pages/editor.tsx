import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ColorPicker from '@/components/color-picker';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { HHKB_PALETTE } from '@/constants/colors';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import { useKeyboardState } from '@/hooks/use-keyboard-state';
import { history } from '@/routes';
import { getDesignById, saveDesign } from '@/utils/storage';

export default function Editor() {
    const { keyColors, setKeyColor, fillAll, fillRow, loadColors } = useKeyboardState();
    const [activeColor, setActiveColor] = useState<string>(HHKB_PALETTE.YUKI);
    const [saveName, setSaveName] = useState('');
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
            setKeyColor(hoveredKeyId, activeColor);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hoveredKeyId, activeColor, setKeyColor]);

    function handleSave() {
        if (!saveName.trim()) return;
        saveDesign(saveName.trim(), keyColors);
        setSaveName('');
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
                        onKeyClick={(keyId) => setKeyColor(keyId, activeColor)}
                        onKeyHover={setHoveredKeyId}
                    />
                    <ColorPicker
                        activeColor={activeColor}
                        onColorSelect={setActiveColor}
                    />
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
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.nativeEvent.isComposing) return;
                                if (e.key === 'Enter') handleSave();
                            }}
                            placeholder="デザイン名を入力"
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <button
                            onClick={handleSave}
                            className="bg-gray-800 text-white text-sm px-4 py-1.5 rounded-md hover:bg-gray-700 disabled:opacity-40"
                            disabled={!saveName.trim()}
                        >
                            保存
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}
