import Key from '@/components/key';
import { KEY_DEFAULT_COLOR, KEY_GAP_PX, UNIT_PX } from '@/constants/keyboard';
import type { KeyDefinition } from '@/types/keyboard';

const CANVAS_COLS = 15;
const CANVAS_ROWS = 5;

interface KeyboardCanvasProps {
    layout: KeyDefinition[];
    keyColors: Record<string, string>;
    onKeyClick: (keyId: string) => void;
}

export default function KeyboardCanvas({ layout, keyColors, onKeyClick }: KeyboardCanvasProps) {
    return (
        <div
            className="relative"
            style={{
                width: CANVAS_COLS * UNIT_PX,
                height: CANVAS_ROWS * UNIT_PX,
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
                >
                    <Key
                        label={key.label}
                        width={key.w}
                        color={keyColors[key.id] ?? KEY_DEFAULT_COLOR}
                        onClick={() => onKeyClick(key.id)}
                    />
                </div>
            ))}
        </div>
    );
}
