import { Dimensions, Platform } from "react-native";

export const { width: SW, height: SH } = Dimensions.get("window");

export const BG = "rgba(255, 252, 245, 0.95)";
export const TEXT_PRIMARY = "#000";
export const TEXT_MUTED = "#555";
export const ACCENT = "#000";
export const STRING_COLOR = "#c8b070";
export const TAPE_COLOR = "#e8d5a8";

export const STRING_Y = 30;
export const CARD_W = 88;
export const CARD_H = 110;
export const HANG_LEN = 90;
export const SLOT_W = 160;
export const GALLERY_H = SH * 0.32;

export const FRAME_W = 120;
export const FRAME_H = 100;

export const SCALE_SELECTED = 1.55;

export const mono = Platform.OS === "ios" ? "Courier New" : "monospace";
export const serif = Platform.OS === "ios" ? "Georgia" : "serif";
