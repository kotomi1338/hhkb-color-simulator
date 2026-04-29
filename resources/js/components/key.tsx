import { KEY_DEFAULT_COLOR, KEY_GAP_PX, UNIT_PX } from '@/constants/keyboard';

interface KeyProps {
    label: string;
    width: number;
    color: string;
    onClick: () => void;
}

export default function Key({ label, width, color, onClick }: KeyProps) {
    const bgColor = color || KEY_DEFAULT_COLOR;

    return (
        <button
            onClick={onClick}
            className="absolute flex items-end justify-start select-none cursor-pointer rounded-md transition-transform active:translate-y-px focus:outline-none"
            style={{
                width: width * UNIT_PX - KEY_GAP_PX,
                height: UNIT_PX - KEY_GAP_PX,
                backgroundColor: bgColor,
                boxShadow: '0 3px 0 rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)',
            }}
        >
            <span className="text-[9px] font-medium text-gray-600 leading-none pb-1.5 pl-1.5 pointer-events-none">
                {label}
            </span>
        </button>
    );
}
