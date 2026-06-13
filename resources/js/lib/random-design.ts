import { HHKB_PALETTE } from '@/constants/colors';
import type { KeyDefinition } from '@/types/keyboard';

type ColorMap = Record<string, string>;

const PALETTE = Object.values(HHKB_PALETTE);

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/** Return `count` distinct, randomly ordered palette colors. */
function sampleColors(count: number): string[] {
    const shuffled = [...PALETTE];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

/** Wide keys and Esc act as modifier/accent keys. */
function isAccentKey(key: KeyDefinition): boolean {
    return key.w > 1 || key.id === 'esc' || key.id === 'fn';
}

type Strategy = (layout: KeyDefinition[]) => ColorMap;

/** Single base color with a contrasting accent on the modifier keys. */
const baseAccent: Strategy = (layout) => {
    const [base, accent] = sampleColors(2);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = isAccentKey(key) ? accent : base;
    });
    return map;
};

/** Base + modifier accent, with a third "pop" color on Esc and Space. */
const baseAccentPop: Strategy = (layout) => {
    const [base, accent, pop] = sampleColors(3);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = isAccentKey(key) ? accent : base;
    });
    map.esc = pop;
    map.space = pop;
    return map;
};

/** Each row gets its own color. */
const perRow: Strategy = (layout) => {
    const rowColors = sampleColors(5);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = rowColors[key.y % rowColors.length];
    });
    return map;
};

/** Vertical stripes cycling a small set of colors by column. */
const columnStripes: Strategy = (layout) => {
    const colors = sampleColors(pick([2, 3]));
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = colors[Math.floor(key.x) % colors.length];
    });
    return map;
};

/** Checkerboard of two colors. */
const checker: Strategy = (layout) => {
    const [a, b] = sampleColors(2);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = (Math.floor(key.x) + key.y) % 2 === 0 ? a : b;
    });
    return map;
};

/** A calm base color sprinkled with random accent "confetti". */
const confetti: Strategy = (layout) => {
    const [base, ...accents] = sampleColors(3);
    const map: ColorMap = {};
    layout.forEach((key) => {
        if (!isAccentKey(key) && Math.random() < 0.28) {
            map[key.id] = pick(accents);
        } else {
            map[key.id] = base;
        }
    });
    return map;
};

/** Diagonal bands of a few colors. */
const diagonalStripes: Strategy = (layout) => {
    const colors = sampleColors(pick([3, 4]));
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = colors[(Math.floor(key.x) + key.y) % colors.length];
    });
    return map;
};

const maxColumn = (layout: KeyDefinition[]): number =>
    Math.max(...layout.map((key) => Math.floor(key.x)));

/** Horizontal ombre that transitions colors from left to right. */
const horizontalGradient: Strategy = (layout) => {
    const colors = sampleColors(pick([3, 4]));
    const max = maxColumn(layout) || 1;
    const map: ColorMap = {};
    layout.forEach((key) => {
        const t = Math.floor(key.x) / max;
        map[key.id] = colors[Math.round(t * (colors.length - 1))];
    });
    return map;
};

/** Vertical ombre that transitions colors from the top row to the bottom. */
const verticalGradient: Strategy = (layout) => {
    const maxRow = Math.max(...layout.map((key) => key.y)) || 1;
    const colors = sampleColors(Math.min(maxRow + 1, PALETTE.length));
    const map: ColorMap = {};
    layout.forEach((key) => {
        const t = key.y / maxRow;
        map[key.id] = colors[Math.round(t * (colors.length - 1))];
    });
    return map;
};

/** Highlight just the outer frame of keys against a base color. */
const frame: Strategy = (layout) => {
    const [base, border] = sampleColors(2);
    const maxRow = Math.max(...layout.map((key) => key.y));
    const rowBounds = new Map<number, { min: number; max: number }>();
    layout.forEach((key) => {
        const x = Math.floor(key.x);
        const bounds = rowBounds.get(key.y) ?? { min: x, max: x };
        rowBounds.set(key.y, {
            min: Math.min(bounds.min, x),
            max: Math.max(bounds.max, x),
        });
    });
    const map: ColorMap = {};
    layout.forEach((key) => {
        const bounds = rowBounds.get(key.y)!;
        const x = Math.floor(key.x);
        const onFrame =
            key.y === 0 ||
            key.y === maxRow ||
            x === bounds.min ||
            x === bounds.max;
        map[key.id] = onFrame ? border : base;
    });
    return map;
};

const isLetterKey = (key: KeyDefinition): boolean => /^[a-z]$/.test(key.id);

/** Tint every letter key, leaving the rest on a base color. */
const alphaHighlight: Strategy = (layout) => {
    const [base, letters] = sampleColors(2);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = isLetterKey(key) ? letters : base;
    });
    return map;
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/** Pop the vowels on top of a base + modifier-accent layout. */
const vowelPop: Strategy = (layout) => {
    const [base, accent, vowel] = sampleColors(3);
    const map: ColorMap = {};
    layout.forEach((key) => {
        if (VOWELS.has(key.id)) {
            map[key.id] = vowel;
        } else {
            map[key.id] = isAccentKey(key) ? accent : base;
        }
    });
    return map;
};

/** Split the board into a left and right color. */
const splitHalves: Strategy = (layout) => {
    const [left, right] = sampleColors(2);
    const mid = (maxColumn(layout) + 1) / 2;
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = Math.floor(key.x) < mid ? left : right;
    });
    return map;
};

/** Every key independently picks from a small set of colors. */
const scatter: Strategy = (layout) => {
    const colors = sampleColors(pick([3, 4]));
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = pick(colors);
    });
    return map;
};

/** Strategies other than confetti, picked uniformly. */
const STRATEGIES: Strategy[] = [
    baseAccent,
    baseAccentPop,
    perRow,
    columnStripes,
    checker,
    diagonalStripes,
    horizontalGradient,
    verticalGradient,
    frame,
    alphaHighlight,
    vowelPop,
    splitHalves,
    scatter,
];

/** Confetti shows up roughly this often; the rest share the remainder. */
const CONFETTI_RATE = 0.2;

/**
 * Build a random "cute" color map for the given layout using only the
 * existing palette colors. Cuteness comes from the variety of patterns.
 */
export function generateRandomDesign(layout: KeyDefinition[]): ColorMap {
    const strategy =
        Math.random() < CONFETTI_RATE ? confetti : pick(STRATEGIES);
    return strategy(layout);
}
