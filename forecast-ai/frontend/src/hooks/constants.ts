// src/hooks/constants.ts
import { BiasColorToBiasNameMap, BiasColorToHexCodeMap } from "./types";

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
  