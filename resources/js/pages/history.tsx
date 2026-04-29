import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { home } from '@/routes';
import { deleteDesign, getDesigns, type SavedDesign } from '@/utils/storage';

function DesignCard({ design, onDelete }: { design: SavedDesign; onDelete: () => void }) {
    const uniqueColors = [...new Set(Object.values(design.colors))];
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
                <span className="font-medium text-gray-800 truncate">{design.name}</span>
                <span className="text-xs text-gray-400">{formattedDate}</span>
                <div className="flex gap-1 flex-wrap">
                    {uniqueColors.map((color) => (
                        <span
                            key={color}
                            className="w-4 h-4 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={handleLoad}
                    className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-700"
                >
                    読み込む
                </button>
                <button
                    onClick={handleDelete}
                    className="text-sm text-red-500 hover:text-red-700 px-2 py-1.5"
                >
                    削除
                </button>
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

                <main className="flex-1 p-8 max-w-2xl mx-auto w-full">
                    <h2 className="text-base font-semibold text-gray-700 mb-4">保存済みデザイン</h2>

                    {designs.length === 0 ? (
                        <div className="text-center text-gray-400 py-16">
                            保存されたデザインはありません
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
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
