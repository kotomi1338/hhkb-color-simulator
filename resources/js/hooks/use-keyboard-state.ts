import { useCallback, useState } from 'react';
import type { KeyDefinition } from '@/types/keyboard';

type KeyColorMap = Record<string, string>;

interface UseKeyboardStateReturn {
    keyColors: KeyColorMap;
    setKeyColor: (keyId: string, color: string) => void;
    fillAll: (layout: KeyDefinition[], color: string) => void;
    fillRow: (layout: KeyDefinition[], row: number, color: string) => void;
    loadColors: (colors: KeyColorMap) => void;
    resetColors: () => void;
}

export function useKeyboardState(): UseKeyboardStateReturn {
    const [keyColors, setKeyColors] = useState<KeyColorMap>({});

    const setKeyColor = useCallback((keyId: string, color: string) => {
        setKeyColors((prev) => ({ ...prev, [keyId]: color }));
    }, []);

    const fillAll = useCallback((layout: KeyDefinition[], color: string) => {
        const next: KeyColorMap = {};
        layout.forEach((key) => { next[key.id] = color; });
        setKeyColors(next);
    }, []);

    const fillRow = useCallback((layout: KeyDefinition[], row: number, color: string) => {
        setKeyColors((prev) => {
            const next = { ...prev };
            layout.filter((key) => key.y === row).forEach((key) => { next[key.id] = color; });
            return next;
        });
    }, []);

    const loadColors = useCallback((colors: KeyColorMap) => {
        setKeyColors(colors);
    }, []);

    const resetColors = useCallback(() => {
        setKeyColors({});
    }, []);

    return { keyColors, setKeyColor, fillAll, fillRow, loadColors, resetColors };
}
