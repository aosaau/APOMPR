import { OpalData } from '../data/opals';

export interface ValuationOutput {
  impliedFairValue: number;
  minerCutterVariance: number; // percentage
  marketCutterVariance: number; // percentage
  marketVarianceIndex: number;
  inefficiencyScore: number;
  hiddenValueIndicator: number;
  liquidityScore: number;
  rarityPercentile: number;
  grade: string;
  confidenceScore: number;
}

export function runVerifyAIEngine(opal: OpalData): ValuationOutput {
  // --- 1. Grading Logic (Feature Mapping -> M1-M9) --- //
  let baseGradeValue = 1;
  const bMap: Record<string, number> = { 'B7': 1, 'B6': 2, 'B5': 3, 'B4': 4, 'B3': 5, 'B2': 7, 'B1': 9 };
  const nMap: Record<string, number> = { 'N9': 1, 'N8': 1, 'N7': 2, 'N6': 3, 'N5': 4, 'N4': 5, 'N3': 6, 'N2': 7, 'N1': 9 };
  const pMap: Record<string, number> = { 'Pinfire': 1, 'Flash': 3, 'Ribbon': 6, 'Harlequin': 9 };
  
  const bScore = bMap[opal.brightness] || 1;
  const nScore = nMap[opal.bodyTone] || 1;
  const pScore = pMap[opal.pattern] || 1;
  
  // Weights based on rarity/importance 
  const computedScore = (bScore * 0.4) + (nScore * 0.35) + (pScore * 0.25);
  const derivedMGrade = Math.max(1, Math.min(9, Math.round(computedScore)));
  
  const predictedGrade = `M${derivedMGrade}`;
  
  // Confidence score: higher if mk_grade matches derived grade
  const confidenceScore = Math.max(0, 100 - (Math.abs(derivedMGrade - opal.mk_grade) * 15) - (opal.stabilityRisk === 'High' ? 20 : 0));

  // --- 2. Valuation Formulation --- //
  const roughVal = opal.mk_rough_total;
  const cutVal = opal.mk_cut_total || roughVal * 2; // approximation if missing
  const marketVal = opal.mr_offer || roughVal * 1.5;

  // Implied Fair Value (weighted heavily toward institutional cut value if exists, but anchored by market reality)
  const impliedFairValue = (cutVal * 0.5) + (marketVal * 0.3) + (roughVal * 0.2);

  // Variance mapping
  const minerCutterVariance = ((cutVal - roughVal) / roughVal) * 100;
  const marketCutterVariance = ((marketVal - cutVal) / cutVal) * 100;
  
  // Market Variance Index (MVI): How heavily the market diverges from theoretical fair value
  const marketVarianceIndex = ((marketVal - impliedFairValue) / impliedFairValue) * 100;

  // --- 3. Inefficiency Score --- //
  // Formula: How far apart is the market's grade from the miner's grade?
  const gradeSpread = Math.abs(opal.mk_grade - opal.mr_grade);
  const inefficiencyScore = Math.min(100, (gradeSpread / 9) * 100 + Math.abs(marketVarianceIndex)/2);

  // --- 4. Hidden Value Indicator --- //
  // Detects massive gaps where Cut Value >> Market Offer
  let hiddenValueIndicator = 0;
  if (cutVal > marketVal) {
    hiddenValueIndicator = ((cutVal - marketVal) / marketVal) * 100; // e.g. 200% upside
  }

  // --- 5. Liquidity Score --- //
  // Higher value relative to weight limits liquidity, but higher grade increases demand liquidity.
  // Formula logic: A Harlequin at $90k takes longer to sell than a Pinfire at $500, but is more sought after.
  const baseLiquidity = 50; 
  const demandModifier = derivedMGrade * 5; 
  const priceResistance = Math.min(40, (impliedFairValue / 1000)); // higher price = more friction
  const liquidityScore = Math.max(1, Math.min(99, baseLiquidity + demandModifier - priceResistance));

  // --- 6. Rarity Percentile --- //
  // Harlequin + N1 + B1 = Top 0.01%
  const rarityPercentile = Math.min(99.99, (computedScore / 9) * 99.9);

  return {
    impliedFairValue,
    minerCutterVariance,
    marketCutterVariance,
    marketVarianceIndex,
    inefficiencyScore,
    hiddenValueIndicator,
    liquidityScore,
    rarityPercentile,
    grade: predictedGrade,
    confidenceScore
  };
}
