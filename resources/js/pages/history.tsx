import { Head, Link, router, usePage } from '@inertiajs/react';
import { destroy } from '@/actions/App/Http/Controllers/DesignController';
import { index as presentationIndex } from '@/actions/App/Http/Controllers/PresentationController';
import AuthControl from '@/components/auth-control';
import KeyboardPreview from '@/components/keyboard-preview';
import { home } from '@/routes';
import type { Design } from '@/types';

function DesignCard({
    design,
    canDelete,
}: {
    design: Design;
    canDelete: boolean;
}) {
    const formattedDate = new Date(design.created_at).toLocaleString('ja-JP', {
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
        router.delete(destroy.url(design.id));
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-center border-b border-gray-100 bg-gray-50 p-4">
                <KeyboardPreview colors={design.colors} />
            </div>
            <div className="flex flex-col gap-3 p-4">
                <div>
                    <p className="text-xs text-gray-400">{formattedDate}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleLoad}
                        className="flex-1 rounded-md bg-gray-800 py-1.5 text-sm text-white hover:bg-gray-700"
                    >
                        読み込む
                    </button>
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700"
                        >
                            削除
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function History({ designs }: { designs: Design[] }) {
    const { auth } = usePage().props;
    const canDelete = auth.user?.role === 'admin';

    return (
        <>
            <Head title="History - HHKB Color Simulator" />
            <div className="flex min-h-screen flex-col bg-gray-100">
                <header className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
                    <h1 className="truncate text-base font-semibold text-gray-800 sm:text-lg">
                        HHKB Color Simulator
                    </h1>
                    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                        <Link
                            href={home.url()}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Editor
                        </Link>
                        {canDelete && (
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

                <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-8">
                    <h2 className="mb-6 text-base font-semibold text-gray-700">
                        保存済みデザイン
                    </h2>

                    {designs.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            保存されたデザインはありません
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {designs.map((design) => (
                                <DesignCard
                                    key={design.id}
                                    design={design}
                                    canDelete={canDelete}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
