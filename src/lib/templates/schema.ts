export type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export type TemplateCategory =
  | "single-image"
  | "collage"
  | "quote"
  | "carousel-cover";

export type TemplateSlot = {
  id: string;
  /**
   * Normalized coordinates within the canvas (0–1)
   */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TemplateTextArea = {
  id: string;
  label: string;
  /**
   * Normalized coordinates within the canvas (0–1)
   */
  x: number;
  y: number;
  maxWidth: number;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  category: TemplateCategory;
  aspectRatio: AspectRatio;
  tags: string[];
  description?: string;
  slots: TemplateSlot[];
  textAreas: TemplateTextArea[];
};

