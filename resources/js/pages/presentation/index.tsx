import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    reorder,
    slideshow,
    update,
} from '@/actions/App/Http/Controllers/PresentationController';
import AuthControl from '@/components/auth-control';
import KeyboardPreview from '@/components/keyboard-preview';
import { history, home } from '@/routes';
import type { PresentationSlide } from '@/types';

function persistOrder(slides: PresentationSlide[]) {
    router.patch(
        reorder.url(),
        { order: slides.map((slide) => slide.id) },
        { preserveScroll: true, preserveState: true },
    );
}

function persistSlide(slide: PresentationSlide) {
    router.patch(
        update.url(slide.id),
        { name: slide.name, comment: slide.comment },
        { preserveScroll: true, preserveState: true },
    );
}

function SlideRow({
    slide,
    index,
    onChange,
    onDragStart,
    onDragEnter,
    onDragEnd,
    isDragging,
}: {
    slide: PresentationSlide;
    index: number;
    onChange: (next: PresentationSlide) => void;
    onDragStart: () => void;
    onDragEnter: () => void;
    onDragEnd: () => void;
    isDragging: boolean;
}) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                <span
                    className="cursor-grab pt-1 text-gray-400 select-none active:cursor-grabbing"
                    title="ドラッグして並び替え"
                >
                    ⠿
                </span>
                <div className="rounded border border-gray-100 bg-gray-50 p-2">
                    <KeyboardPreview colors={slide.design.colors} />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm font-semibold text-gray-500">
                        No.{index + 1}
                    </span>
                    <input
                        type="text"
                        value={slide.name ?? ''}
                        placeholder="名前を入力"
                        onChange={(e) =>
                            onChange({ ...slide, name: e.target.value })
                        }
                        onBlur={() => persistSlide(slide)}
                        className="flex-1 border-b border-gray-200 py-1 text-sm focus:border-gray-500 focus:outline-none"
                    />
                </div>
                <textarea
                    value={slide.comment ?? ''}
                    placeholder="コメントを入力（改行できます）"
                    rows={2}
                    onChange={(e) =>
                        onChange({ ...slide, comment: e.target.value })
                    }
                    onBlur={() => persistSlide(slide)}
                    className="w-full resize-y rounded-md border border-gray-200 p-2 text-sm text-gray-600 focus:border-gray-500 focus:outline-none"
                />
            </div>
        </div>
    );
}

export default function PresentationIndex({
    slides: initialSlides,
}: {
    slides: PresentationSlide[];
}) {
    const [slides, setSlides] = useState<PresentationSlide[]>(initialSlides);
    const dragIndex = useRef<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    function updateSlide(next: PresentationSlide) {
        setSlides((current) =>
            current.map((slide) => (slide.id === next.id ? next : slide)),
        );
    }

    function handleDragEnter(targetIndex: number) {
        const from = dragIndex.current;
        if (from === null || from === targetIndex) {
            return;
        }
        setSlides((current) => {
            const reordered = [...current];
            const [moved] = reordered.splice(from, 1);
            reordered.splice(targetIndex, 0, moved);
            return reordered;
        });
        dragIndex.current = targetIndex;
        setDraggingIndex(targetIndex);
    }

    function handleDragEnd() {
        dragIndex.current = null;
        setDraggingIndex(null);
        persistOrder(slides);
    }

    return (
        <>
            <Head title="Presentation - HHKB Color Simulator" />
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
                        <Link
                            href={history.url()}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            History
                        </Link>
                        <AuthControl />
                    </div>
                </header>

                <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-700">
                            プレゼンテーション
                        </h2>
                        {slides.length > 0 && (
                            <Link
                                href={slideshow.url()}
                                className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                            >
                                スライドショー開始
                            </Link>
                        )}
                    </div>

                    {slides.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            スライドにできる保存済みデザインがありません
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {slides.map((slide, index) => (
                                <SlideRow
                                    key={slide.id}
                                    slide={slide}
                                    index={index}
                                    onChange={updateSlide}
                                    onDragStart={() => {
                                        dragIndex.current = index;
                                        setDraggingIndex(index);
                                    }}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragEnd={handleDragEnd}
                                    isDragging={draggingIndex === index}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
