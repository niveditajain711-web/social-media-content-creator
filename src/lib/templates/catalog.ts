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
  },
  {
    id: "square-minimal-product",
    name: "Minimal Product",
    category: "single-image",
    aspectRatio: "1:1",
    tags: ["minimal", "product", "clean", "instagram"],
    description: "Clean single-image layout with short title and subtitle.",
    slots: [{ id: "hero", x: 0.08, y: 0.08, width: 0.84, height: 0.62 }],
    textAreas: [
      { id: "title", label: "Title", x: 0.1, y: 0.74, maxWidth: 0.8 },
      { id: "subtitle", label: "Subtitle", x: 0.1, y: 0.84, maxWidth: 0.8 }
    ]
  },
  {
    id: "story-vertical-highlight",
    name: "Story Highlight",
    category: "single-image",
    aspectRatio: "9:16",
    tags: ["story", "vertical", "instagram", "mobile"],
    description: "Vertical story post with a top headline and bottom CTA.",
    slots: [{ id: "story-image", x: 0.06, y: 0.12, width: 0.88, height: 0.7 }],
    textAreas: [
      { id: "headline", label: "Headline", x: 0.08, y: 0.05, maxWidth: 0.84 },
      { id: "cta", label: "CTA", x: 0.08, y: 0.86, maxWidth: 0.84 }
    ]
  },
  {
    id: "linkedin-announcement",
    name: "LinkedIn Announcement",
    category: "single-image",
    aspectRatio: "16:9",
    tags: ["linkedin", "announcement", "corporate"],
    description: "Wide announcement design for professional updates.",
    slots: [{ id: "feature", x: 0.04, y: 0.08, width: 0.46, height: 0.84 }],
    textAreas: [
      { id: "headline", label: "Headline", x: 0.54, y: 0.22, maxWidth: 0.4 },
      { id: "details", label: "Details", x: 0.54, y: 0.46, maxWidth: 0.4 }
    ]
  },
  {
    id: "collage-feature-3",
    name: "Feature Collage",
    category: "collage",
    aspectRatio: "4:5",
    tags: ["collage", "feature", "promo"],
    description: "Three-image collage with a strong caption zone.",
    slots: [
      { id: "left-large", x: 0.05, y: 0.08, width: 0.56, height: 0.58 },
      { id: "right-top", x: 0.64, y: 0.08, width: 0.31, height: 0.28 },
      { id: "right-bottom", x: 0.64, y: 0.38, width: 0.31, height: 0.28 }
    ],
    textAreas: [{ id: "caption", label: "Caption", x: 0.08, y: 0.74, maxWidth: 0.84 }]
  },
  {
    id: "quote-bold-center",
    name: "Bold Quote",
    category: "quote",
    aspectRatio: "1:1",
    tags: ["quote", "bold", "branding"],
    description: "High-impact quote card with speaker attribution.",
    slots: [],
    textAreas: [
      { id: "quote", label: "Quote", x: 0.14, y: 0.28, maxWidth: 0.72 },
      { id: "speaker", label: "Speaker", x: 0.14, y: 0.72, maxWidth: 0.5 }
    ]
  },
  {
    id: "quote-soft-corporate",
    name: "Corporate Quote",
    category: "quote",
    aspectRatio: "4:5",
    tags: ["quote", "corporate", "linkedin", "minimal"],
    description: "Professional quote format suited for teams and founders.",
    slots: [],
    textAreas: [
      { id: "quote", label: "Quote", x: 0.12, y: 0.24, maxWidth: 0.76 },
      { id: "name", label: "Name", x: 0.12, y: 0.68, maxWidth: 0.5 },
      { id: "role", label: "Role", x: 0.12, y: 0.77, maxWidth: 0.6 }
    ]
  },
  {
    id: "carousel-cover-bold",
    name: "Carousel Cover Bold",
    category: "carousel-cover",
    aspectRatio: "4:5",
    tags: ["carousel", "bold", "education", "slide-1"],
    description: "Big title with stacked image strips for carousel intros.",
    slots: [
      { id: "top-strip", x: 0.06, y: 0.08, width: 0.88, height: 0.18 },
      { id: "middle-strip", x: 0.06, y: 0.29, width: 0.88, height: 0.18 },
      { id: "bottom-strip", x: 0.06, y: 0.5, width: 0.88, height: 0.18 }
    ],
    textAreas: [
      { id: "title", label: "Title", x: 0.08, y: 0.73, maxWidth: 0.84 },
      { id: "subtitle", label: "Subtitle", x: 0.08, y: 0.85, maxWidth: 0.84 }
    ]
  },
  {
    id: "product-comparison",
    name: "Product Comparison",
    category: "collage",
    aspectRatio: "1:1",
    tags: ["comparison", "product", "before-after"],
    description: "Two-image side-by-side comparison with a headline.",
    slots: [
      { id: "left", x: 0.05, y: 0.14, width: 0.43, height: 0.68 },
      { id: "right", x: 0.52, y: 0.14, width: 0.43, height: 0.68 }
    ],
    textAreas: [
      { id: "headline", label: "Headline", x: 0.08, y: 0.05, maxWidth: 0.84 },
      { id: "footer", label: "Footer", x: 0.08, y: 0.87, maxWidth: 0.84 }
    ]
  },
  {
    id: "event-poster",
    name: "Event Poster",
    category: "single-image",
    aspectRatio: "4:5",
    tags: ["event", "announcement", "poster"],
    description: "Event promo design with date, title, and location.",
    slots: [{ id: "event-image", x: 0.06, y: 0.07, width: 0.88, height: 0.45 }],
    textAreas: [
      { id: "event-title", label: "Event Title", x: 0.08, y: 0.58, maxWidth: 0.84 },
      { id: "event-date", label: "Date", x: 0.08, y: 0.72, maxWidth: 0.5 },
      { id: "event-location", label: "Location", x: 0.08, y: 0.82, maxWidth: 0.7 }
    ]
  }
];

export function getTemplateById(id: string | null | undefined) {
  if (!id) return undefined;
  return templates.find((t) => t.id === id);
}

