import type { TemplateDefinition } from "./schema";

export const templates: TemplateDefinition[] = [
  {
    id: "square-promo-1",
    name: "Square Promo",
    category: "single-image",
    aspectRatio: "1:1",
    tags: ["promo", "instagram", "product", "bold"],
    description: "Single product hero with bold heading and caption.",
    slots: [
      {
        id: "image-main",
        x: 0.05,
        y: 0.12,
        width: 0.55,
        height: 0.7
      }
    ],
    textAreas: [
      {
        id: "heading",
        label: "Headline",
        x: 0.65,
        y: 0.18,
        maxWidth: 0.28
      },
      {
        id: "body",
        label: "Body",
        x: 0.65,
        y: 0.45,
        maxWidth: 0.28
      },
      {
        id: "cta",
        label: "CTA",
        x: 0.65,
        y: 0.75,
        maxWidth: 0.25
      }
    ]
  },
  {
    id: "quote-card-1",
    name: "Quote Card",
    category: "quote",
    aspectRatio: "4:5",
    tags: ["quote", "minimal", "linkedin"],
    description: "Centered quote with author and subtle frame.",
    slots: [],
    textAreas: [
      {
        id: "quote",
        label: "Quote",
        x: 0.15,
        y: 0.25,
        maxWidth: 0.7
      },
      {
        id: "author",
        label: "Author",
        x: 0.15,
        y: 0.7,
        maxWidth: 0.4
      }
    ]
  },
  {
    id: "collage-2x2",
    name: "Collage 2×2",
    category: "collage",
    aspectRatio: "1:1",
    tags: ["collage", "grid", "instagram"],
    description: "Four-image grid, perfect for recap posts.",
    slots: [
      { id: "top-left", x: 0.05, y: 0.05, width: 0.425, height: 0.425 },
      { id: "top-right", x: 0.525, y: 0.05, width: 0.425, height: 0.425 },
      { id: "bottom-left", x: 0.05, y: 0.525, width: 0.425, height: 0.425 },
      { id: "bottom-right", x: 0.525, y: 0.525, width: 0.425, height: 0.425 }
    ],
    textAreas: [
      {
        id: "caption",
        label: "Caption",
        x: 0.08,
        y: 0.88,
        maxWidth: 0.84
      }
    ]
  },
  {
    id: "carousel-cover-1",
    name: "Carousel Cover",
    category: "carousel-cover",
    aspectRatio: "4:5",
    tags: ["carousel", "cover", "slide-1"],
    description: "Hero image plus title/subtitle for your first carousel slide.",
    slots: [
      {
        id: "hero-image",
        x: 0.06,
        y: 0.08,
        width: 0.88,
        height: 0.5
      },
      {
        id: "accent-image",
        x: 0.68,
        y: 0.62,
        width: 0.26,
        height: 0.18
      }
    ],
    textAreas: [
      {
        id: "title",
        label: "Title",
        x: 0.1,
        y: 0.66,
        maxWidth: 0.56
      },
      {
        id: "subtitle",
        label: "Subtitle",
        x: 0.1,
        y: 0.8,
        maxWidth: 0.56
      }
    ]
  }
];

export function getTemplateById(id: string | null | undefined) {
  if (!id) return undefined;
  return templates.find((t) => t.id === id);
}

