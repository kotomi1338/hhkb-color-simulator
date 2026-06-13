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
    onFocus,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onFocus?: () => void;
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
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            className={className}
        />
    );
}

/** An input that grows to fit its content so it can sit inline next to the No. label. */
function AutoWidthInput({
    value,
    onChange,
    onBlur,
    onFocus,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onFocus?: () => void;
    className: string;
}) {
    return (
        <span className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1 px-1 whitespace-pre">
                {value || ' '}
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                className={`col-start-1 row-start-1 w-full bg-transparent px-1 text-center focus:outline-none ${className}`}
            />
        </span>
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
    const [isEditing, setIsEditing] = useState(false);
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

    // Auto-advance to the next slide every 7 seconds (looping at the end),
    // pausing while the name or comment is being edited.
    useEffect(() => {
        if (isEditing || total <= 1) {
            return;
        }
        const timer = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 7000);
        return () => clearTimeout(timer);
    }, [current, isEditing, total]);

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
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-500">
                    <p>表示できるスライドがありません</p>
                    <Link
                        href={presentationIndex.url()}
                        className="text-sm text-gray-400 hover:text-gray-700"
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
                className="relative flex min-h-screen flex-col bg-white px-4 py-10 text-gray-900 sm:px-16"
            >
                <Link
                    href={presentationIndex.url()}
                    className="absolute top-4 left-4 text-sm text-gray-400 hover:text-gray-700"
                >
                    ← 管理に戻る
                </Link>
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 text-sm text-gray-400 hover:text-gray-700"
                >
                    {isFullscreen ? '通常表示' : 'フルスクリーン'}
                </button>

                <h1 className="mt-10 flex flex-wrap items-baseline justify-center gap-x-3 text-center text-6xl leading-tight font-bold sm:text-7xl">
                    <span className="shrink-0">No.{current + 1}</span>
                    <AutoWidthInput
                        value={slide.name ?? ''}
                        onChange={(value) => editSlide({ name: value })}
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => {
                            setIsEditing(false);
                            persistSlide(slide);
                        }}
                        className="font-bold"
                    />
                </h1>

                <div className="flex flex-1 flex-col items-center justify-center gap-10 py-10">
                    <div className="pointer-events-none rounded-2xl border border-gray-300 bg-white p-6 shadow-sm sm:p-10">
                        <KeyboardCanvas
                            layout={US_HHKB_LAYOUT}
                            keyColors={slide.design.colors}
                            onKeyClick={() => {}}
                        />
                    </div>

                    <AutoTextarea
                        value={slide.comment ?? ''}
                        onChange={(value) => editSlide({ comment: value })}
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => {
                            setIsEditing(false);
                            persistSlide(slide);
                        }}
                        className="w-full max-w-3xl resize-none overflow-hidden bg-transparent text-center text-3xl whitespace-pre-wrap text-gray-600 focus:outline-none"
                    />
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={() => goTo(current - 1)}
                        disabled={current === 0}
                        className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                    >
                        ← 前へ
                    </button>
                    <span className="text-sm text-gray-400">
                        {current + 1} / {total}
                    </span>
                    <button
                        onClick={() => goTo(current + 1)}
                        disabled={current === total - 1}
                        className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                    >
                        次へ →
                    </button>
                </div>
            </div>
        </>
    );
}
