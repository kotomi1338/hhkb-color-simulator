const STORAGE_KEY = 'hhkb-designs';

export interface SavedDesign {
    id: string;
    layoutType: string;
    colors: Record<string, string>;
    savedAt: string;
}

export function getDesigns(): SavedDesign[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as SavedDesign[];
    } catch {
        return [];
    }
}

export function getDesignById(id: string): SavedDesign | undefined {
    return getDesigns().find((d) => d.id === id);
}

export function saveDesign(colors: Record<string, string>): SavedDesign {
    const design: SavedDesign = {
        id: crypto.randomUUID(),
        layoutType: 'US_HHKB',
        colors,
        savedAt: new Date().toISOString(),
    };
    const designs = getDesigns();
    designs.unshift(design);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return design;
}

export function deleteDesign(id: string): void {
    const designs = getDesigns().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
}
