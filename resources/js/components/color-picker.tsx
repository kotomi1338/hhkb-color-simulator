import { HHKB_PALETTE } from '@/constants/colors';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    activeColor: string;
    onColorSelect: (color: string) => void;
}

const PALETTE_ENTRIES = [
    { color: HHKB_PALETTE.YUKI, label: '雪' },
    { color: HHKB_PALETTE.TANPOPO, label: '蒲公英' },
    { color: HHKB_PALETTE.SAKURA, label: '桜' },
    { color: HHKB_PALETTE.WASABI, label: '山葵' },
    { color: HHKB_PALETTE.FUJI, label: '藤' },
    { color: HHKB_PALETTE.SORA, label: '空' },
] as const;

export default function ColorPicker({ activeColor, onColorSelect }: ColorPickerProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {PALETTE_ENTRIES.map(({ color, label }) => (
                <button
                    key={color}
                    onClick={() => onColorSelect(color)}
                    className={cn(
                        'flex flex-col items-center gap-1.5 group focus:outline-none',
                    )}
                >
                    <span
                        className={cn(
                            'w-10 h-10 rounded-full border border-black/10 transition-transform group-hover:scale-110',
                            activeColor === color && 'ring-2 ring-gray-700 ring-offset-2 scale-110',
                        )}
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] text-gray-500">{label}</span>
                </button>
            ))}
        </div>
    );
}
