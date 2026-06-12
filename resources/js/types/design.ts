export type Design = {
    id: string;
    layout_type: string;
    colors: Record<string, string>;
    created_at: string;
};

export type PresentationSlide = {
    id: string;
    design_id: string;
    name: string | null;
    comment: string | null;
    sort_order: number;
    design: Design;
};
