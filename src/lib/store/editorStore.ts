import { create } from "zustand";
import type { TemplateDefinition, TemplateSlot, TemplateTextArea } from "../templates/schema";

export type UploadedPhoto = {
  id: string;
  fileName: string;
  objectUrl: string;
  dataUrl?: string;
  width?: number;
  height?: number;
};

export type SlotAssignment = {
  slotId: string;
  photoId: string;
  offsetX: number;
  offsetY: number;
  scale: number;
};

export type TextBlock = {
  areaId: string;
  value: string;
};

export type ExportFormat = "png" | "jpeg";

export type AiPlatform = "instagram" | "linkedin" | "twitter" | "facebook";
export type AiTone = "professional" | "playful" | "bold";
export type AiLength = "short" | "medium" | "long";
export type AiProvider = "auto" | "gemini" | "openrouter" | "mock";

export type AiCaptionSuggestion = {
  id: string;
  caption: string;
  hashtags?: string[];
};

export type EditorState = {
  selectedTemplateId: string | null;
  exportFormat: ExportFormat;
  photos: UploadedPhoto[];
  slotAssignments: SlotAssignment[];
  textBlocks: TextBlock[];
  aiPlatform: AiPlatform;
  aiTone: AiTone;
  aiLength: AiLength;
  aiProvider: AiProvider;
  aiTopic: string;
  aiLoading: boolean;
  aiSuggestions: AiCaptionSuggestion[];
  mainCaptionAreaId: string | null;
  selectedSlotId: string | null;
};

type EditorActions = {
  loadFromTemplate(template: TemplateDefinition): void;
  setTemplate(id: string | null): void;
  addUploadedPhotos(files: UploadedPhoto[]): void;
  assignPhotoToSlot(slot: TemplateSlot, photoId: string): void;
  updateSlotTransform(slotId: string, updates: Partial<Pick<SlotAssignment, "offsetX" | "offsetY" | "scale">>): void;
  updateText(area: TemplateTextArea, value: string): void;
  setExportFormat(format: ExportFormat): void;
  selectSlot(slotId: string | null): void;
  setAiConfig(config: Partial<Pick<EditorState, "aiPlatform" | "aiTone" | "aiLength" | "aiProvider" | "aiTopic">>): void;
  setAiLoading(loading: boolean): void;
  setAiSuggestions(suggestions: AiCaptionSuggestion[]): void;
  applyCaptionSuggestion(suggestion: AiCaptionSuggestion): void;
  hydrate(state: Partial<EditorState>): void;
};

const STORAGE_KEY = "smg-web-editor-state-v1";

const defaultState: EditorState = {
  selectedTemplateId: null,
  exportFormat: "png",
  photos: [],
  slotAssignments: [],
  textBlocks: [],
  aiPlatform: "instagram",
  aiTone: "playful",
  aiLength: "medium",
  aiProvider: "auto",
  aiTopic: "",
  aiLoading: false,
  aiSuggestions: [],
  mainCaptionAreaId: null,
  selectedSlotId: null
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...defaultState,

  loadFromTemplate(template) {
    const existingBlocks = get().textBlocks;
    const existingIds = new Set(existingBlocks.map((b) => b.areaId));

    const newBlocks: TextBlock[] = [
      ...existingBlocks,
      ...template.textAreas
        .filter((area) => !existingIds.has(area.id))
        .map((area) => ({
          areaId: area.id,
          value: ""
        }))
    ];

    set({
      selectedTemplateId: template.id,
      textBlocks: newBlocks,
      mainCaptionAreaId: template.textAreas[0]?.id ?? null
    });
  },

  setTemplate(id) {
    set({ selectedTemplateId: id });
  },

  addUploadedPhotos(files) {
    set((state) => ({
      photos: [...state.photos, ...files]
    }));
  },

  assignPhotoToSlot(slot, photoId) {
    set((state) => {
      const existing = state.slotAssignments.find((s) => s.slotId === slot.id);
      const base: SlotAssignment = {
        slotId: slot.id,
        photoId,
        offsetX: existing?.offsetX ?? 0,
        offsetY: existing?.offsetY ?? 0,
        scale: existing?.scale ?? 1
      };

      const others = state.slotAssignments.filter((s) => s.slotId !== slot.id);
      return {
        slotAssignments: [...others, base],
        selectedSlotId: slot.id
      };
    });
  },

  updateSlotTransform(slotId, updates) {
    set((state) => ({
      slotAssignments: state.slotAssignments.map((s) =>
        s.slotId === slotId ? { ...s, ...updates } : s
      )
    }));
  },

  updateText(area, value) {
    set((state) => {
      const exists = state.textBlocks.find((b) => b.areaId === area.id);
      if (!exists) {
        return {
          textBlocks: [...state.textBlocks, { areaId: area.id, value }]
        };
      }
      return {
        textBlocks: state.textBlocks.map((b) =>
          b.areaId === area.id ? { ...b, value } : b
        )
      };
    });
  },

  setExportFormat(format) {
    set({ exportFormat: format });
  },

  selectSlot(slotId) {
    set({ selectedSlotId: slotId });
  },

  setAiConfig(config) {
    set(config);
  },

  setAiLoading(loading) {
    set({ aiLoading: loading });
  },

  setAiSuggestions(suggestions) {
    set({ aiSuggestions: suggestions });
  },

  applyCaptionSuggestion(suggestion) {
    const { mainCaptionAreaId, textBlocks } = get();
    if (!mainCaptionAreaId) return;
    const exists = textBlocks.find((b) => b.areaId === mainCaptionAreaId);
    if (!exists) return;
    set({
      textBlocks: textBlocks.map((b) =>
        b.areaId === mainCaptionAreaId ? { ...b, value: suggestion.caption } : b
      )
    });
  },

  hydrate(partial) {
    set((state) => ({
      ...state,
      ...partial
    }));
  }
}));

// Persistence helpers
export function saveEditorStateToStorage(state: EditorState) {
  try {
    const toStore: EditorState = {
      ...state,
      photos: state.photos,
      slotAssignments: state.slotAssignments
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // ignore
  }
}

export function loadEditorStateFromStorage(): Partial<EditorState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EditorState;
  } catch {
    return null;
  }
}

