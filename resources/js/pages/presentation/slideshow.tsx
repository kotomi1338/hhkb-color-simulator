import { Head, Link, router } from '@inertiajs/react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {
    index as presentationIndex,
    update,
} from '@/actions/App/Http/Controllers/PresentationController';
import KeyboardCanvas from '@/components/keyboard-canvas';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';
import type { PresentationSlide } from '@/types';

function persistSlide(slide: PresentationSlide) {
    router.patch(
        update.url(slide.id),
        { name: slide.name, comment: slide.comment },
        { preserveScroll: true, preserveState: true },
    );
}

/** A textarea that grows with its content and carries no editor chrome. */
function AutoTextarea({
    value,
    onChange,
    onBlur,
    placeholder,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    placeholder: string;
    className: string;
}) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <textarea
            ref={ref}
            rows={1}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={className}
        />
    );
}

export default function Slideshow({
    slides: initialSlides,
}: {
    slides: PresentationSlide[];
}) {
    const [slides, setSlides] = useState<PresentationSlide[]>(initialSlides);
    const [current, setCurrent] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const total = slides.length;
    const slide = slides[current];

    const goTo = useCallback(
        (next: number) => {
            setCurrent((prev) => {
                if (total === 0) {
                    return prev;
                }
                return Math.min(Math.max(next, 0), total - 1);
            });
        },
        [total],
    );

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }
            if (e.key === 'ArrowRight') {
                goTo(current + 1);
            } else if (e.key === 'ArrowLeft') {
                goTo(current - 1);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [current, goTo]);

    useEffect(() => {
        function handleChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }
        document.addEventListener('fullscreenchange', handleChange);
        return () =>
            document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            containerRef.current?.requestFullscreen();
        }
    }

    function editSlide(patch: Partial<PresentationSlide>) {
        setSlides((currentSlides) =>
            currentSlides.map((s) =>
                s.id === slide.id ? { ...s, ...patch } : s,
            ),
        );
    }

    if (total === 0) {
        return (
            <>
                <Head title="Slideshow - HHKB Color Simulator" />
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-900 text-gray-300">
                    <p>表示できるスライドがありません</p>
                    <Link
                        href={presentationIndex.url()}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        管理に戻る
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Slideshow - HHKB Color Simulator" />
            <div
                ref={containerRef}
                className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-900 px-4 py-12 text-white sm:px-16"
            >
                <Link
                    href={presentationIndex.url()}
                    className="absolute top-4 left-4 text-sm text-gray-500 hover:text-white"
                >
                    ← 管理に戻る
                </Link>
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 text-sm text-gray-500 hover:text-white"
                >
                    {isFullscreen ? '通常表示' : 'フルスクリーン'}
                </button>

                <div className="flex w-full max-w-3xl flex-col items-center gap-2 text-center">
                    <div className="flex w-full items-baseline justify-center gap-2">
                        <span className="shrink-0 text-2xl font-semibold text-gray-400">
                            No.{current + 1}
                        </span>
                        <input
                            type="text"
                            value={slide.name ?? ''}
                            placeholder="名前を入力"
                            onChange={(e) =>
                                editSlide({ name: e.target.value })
                            }
                            onBlur={() => persistSlide(slide)}
                            className="min-w-0 flex-1 bg-transparent text-center text-2xl font-semibold text-white placeholder:text-gray-600 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="w-full max-w-3xl">
                    <div className="pointer-events-none">
                        <KeyboardCanvas
                            layout={US_HHKB_LAYOUT}
                            keyColors={slide.design.colors}
                            onKeyClick={() => {}}
                        />
                    </div>
                </div>

                <AutoTextarea
                    value={slide.comment ?? ''}
                    placeholder="コメントを入力（改行できます）"
                    onChange={(value) => editSlide({ comment: value })}
                    onBlur={() => persistSlide(slide)}
                    className="w-full max-w-3xl resize-none overflow-hidden bg-transparent text-center text-base whitespace-pre-wrap text-gray-300 placeholder:text-gray-600 focus:outline-none"
                />

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => goTo(current - 1)}
                        disabled={current === 0}
                        className="rounded-md px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-30"
                    >
                        ← 前へ
                    </button>
                    <span className="text-sm text-gray-500">
                        {current + 1} / {total}
                    </span>
                    <button
                        onClick={() => goTo(current + 1)}
                        disabled={current === total - 1}
                        className="rounded-md px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-30"
                    >
                        次へ →
                    </button>
                </div>
            </div>
        </>
    );
}
