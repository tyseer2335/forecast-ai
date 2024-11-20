// src/hooks/constants.ts
import { BiasColor, BiasColorToBiasNameMap, BiasColorToHexCodeMap } from "./types";

export const biasColorToBiasNameMap : BiasColorToBiasNameMap = {
    green: "statistical_reasoning",
    yellow: "statistical_refinement",
    purple: "causal_reasoning",
    red: "statistical_causal_blend",
};

export const biasColorToHexCodeMap : BiasColorToHexCodeMap = {
  green: "#53A866",
  yellow: "#FDD178",
  purple: "#AEB0FF",
  red: "#FF1A00",
};

export const biasColorToRGBAMap : BiasColorToHexCodeMap = {
  green: "rgba(83, 168, 102, A)",
  yellow: "rgba(253, 209, 120, A)",
  purple: "rgba(174, 176, 255, A)",
  red: "rgba(255, 26, 0, A)",
};
  