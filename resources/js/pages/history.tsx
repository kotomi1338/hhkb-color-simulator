import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { UNIT_PX } from '@/constants/keyboard';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import { home } from '@/routes';
import { deleteDesign, getDesigns, type SavedDesign } from '@/utils/storage';

const CANVAS_W = 15 * UNIT_PX;
const CANVAS_H = 5 * UNIT_PX;
const PREVIEW_SCALE = 0.3;
const PREVIEW_W = Math.round(CANVAS_W * PREVIEW_SCALE);
const PREVIEW_H = Math.round(CANVAS_H * PREVIEW_SCALE);

function KeyboardPreview({ colors }: { colors: Record<string, string> }) {
    return (
        <div
            className="overflow-hidden rounded"
            style={{ width: PREVIEW_W, height: PREVIEW_H }}
        >
            <div
                style={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                }}
            >
                <KeyboardCanvas
                    layout={US_HHKB_LAYOUT}
                    keyColors={colors}
                    onKeyClick={() => {}}
                />
            </div>
        </div>
    );
}

function DesignCard({ design, onDelete }: { design: SavedDesign; onDelete: () => void }) {
    const formattedDate = new Date(design.savedAt).toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    function handleLoad() {
        router.visit(home.url() + `?load=${design.id}`);
    }

    function handleDelete() {
        deleteDesign(design.id);
        onDelete();
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                <KeyboardPreview colors={design.colors} />
            </div>
            <div className="p-4 flex flex-col gap-3">
                <div>
                    <p className="font-medium text-gray-800 truncate">{design.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleLoad}
                        className="flex-1 text-sm bg-gray-800 text-white py-1.5 rounded-md hover:bg-gray-700"
                    >
                        読み込む
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5"
                    >
                        削除
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function History() {
    const [designs, setDesigns] = useState<SavedDesign[]>(() => getDesigns());

    function refresh() {
        setDesigns(getDesigns());
    }

    return (
        <>
            <Head title="History - HHKB Color Simulator" />
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">HHKB Color Simulator</h1>
                    <Link href={home.url()} className="text-sm text-gray-500 hover:text-gray-700">
                        Editor
                    </Link>
                </header>

                <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
                    <h2 className="text-base font-semibold text-gray-700 mb-6">保存済みデザイン</h2>

                    {designs.length === 0 ? (
                        <div className="text-center text-gray-400 py-16">
                            保存されたデザインはありません
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {designs.map((design) => (
                                <DesignCard key={design.id} design={design} onDelete={refresh} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
