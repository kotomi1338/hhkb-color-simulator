import { useCallback, useState } from 'react';

type KeyColorMap = Record<string, string>;

interface UseKeyboardStateReturn {
    keyColors: KeyColorMap;
    setKeyColor: (keyId: string, color: string) => void;
    loadColors: (colors: KeyColorMap) => void;
    resetColors: () => void;
}

export function useKeyboardState(): UseKeyboardStateReturn {
    const [keyColors, setKeyColors] = useState<KeyColorMap>({});

    const setKeyColor = useCallback((keyId: string, color: string) => {
        setKeyColors((prev) => ({ ...prev, [keyId]: color }));
    }, []);

    const loadColors = useCallback((colors: KeyColorMap) => {
        setKeyColors(colors);
    }, []);

    const resetColors = useCallback(() => {
        setKeyColors({});
    }, []);

    return { keyColors, setKeyColor, loadColors, resetColors };
}
