import KeyboardCanvas from '@/components/keyboard-canvas';
import { UNIT_PX } from '@/constants/keyboard';
import { US_HHKB_LAYOUT } from '@/constants/layouts/us-hhkb';

const CANVAS_W = 15 * UNIT_PX;
const CANVAS_H = 5 * UNIT_PX;

/**
 * Renders a saved design's keyboard at a fixed scale, without any editing UI.
 */
export default function KeyboardPreview({
    colors,
    scale = 0.3,
}: {
    colors: Record<string, string>;
    scale?: number;
}) {
    const width = Math.round(CANVAS_W * scale);
    const height = Math.round(CANVAS_H * scale);

    return (
        <div className="overflow-hidden rounded" style={{ width, height }}>
            <div
                style={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                    transform: `scale(${scale})`,
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
