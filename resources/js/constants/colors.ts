export const HHKB_PALETTE = {
    YUKI: '#FDFDFD',
    TANPOPO: '#FCEBB6',
    SAKURA: '#FCDDE1',
    WASABI: '#C1DEB7',
    FUJI: '#D1C4E9',
    SORA: '#B3E5FC',
} as const;

export type PaletteColor = (typeof HHKB_PALETTE)[keyof typeof HHKB_PALETTE];
