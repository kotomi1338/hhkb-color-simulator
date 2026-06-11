import { useLayoutEffect, useRef, useState } from 'react';
import Key from '@/components/key';
import { HHKB_PALETTE } from '@/constants/colors';
import { KEY_GAP_PX, UNIT_PX } from '@/constants/keyboard';
import type { KeyDefinition } from '@/types/keyboard';

const CANVAS_COLS = 15;
const CANVAS_ROWS = 5;
const NATURAL_W = CANVAS_COLS * UNIT_PX;
const NATURAL_H = CANVAS_ROWS * UNIT_PX;

interface KeyboardCanvasProps {
    layout: KeyDefinition[];
    keyColors: Record<string, string>;
    onKeyClick: (keyId: string) => void;
    onKeyHover?: (keyId: string | null) => void;
}

export default function KeyboardCanvas({ layout, keyColors, onKeyClick, onKeyHover }: KeyboardCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) {
            return;
        }
        const update = () => {
            setScale(Math.min(1, el.clientWidth / NATURAL_W));
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full mx-auto"
            style={{ maxWidth: NATURAL_W, height: NATURAL_H * scale }}
        >
            <div
                className="relative"
                style={{
                    width: NATURAL_W,
                    height: NATURAL_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {layout.map((key) => (
                    <div
                        key={key.id}
                        className="absolute"
                        style={{
                            left: key.x * UNIT_PX + KEY_GAP_PX / 2,
                            top: key.y * UNIT_PX + KEY_GAP_PX / 2,
                        }}
                        onMouseEnter={() => onKeyHover?.(key.id)}
                        onMouseLeave={() => onKeyHover?.(null)}
                    >
                        <Key
                            label={key.label}
                            width={key.w}
                            color={keyColors[key.id] ?? HHKB_PALETTE.YUKI}
                            onClick={() => onKeyClick(key.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
