import { getProductPricing } from '@/shared/utils/pricing';
import type { SimilarCandidate } from '../types';

const TAG_WEIGHT = 3;
const BRAND_WEIGHT = 2;
const PRICE_WEIGHT = 1;
const RATING_WEIGHT = 0.5;
const OUT_OF_STOCK_PENALTY = 2;
const MAX_RATING = 5;

const normalize = (value: string) => value.trim().toLowerCase();

function getScore(target: SimilarCandidate, candidate: SimilarCandidate) {
  const targetTags = new Set(target.tags.map(normalize));
  const sharedTags = new Set(
    candidate.tags.map(normalize).filter(tag => targetTags.has(tag)),
  ).size;
  const sameBrand =
    target.brand !== undefined &&
    candidate.brand !== undefined &&
    normalize(target.brand) === normalize(candidate.brand);

  const targetPrice = getProductPricing(target).finalCents;
  const candidatePrice = getProductPricing(candidate).finalCents;
  const highestPrice = Math.max(targetPrice, candidatePrice);
  const priceCloseness =
    highestPrice === 0
      ? 1
      : 1 - Math.abs(targetPrice - candidatePrice) / highestPrice;

  return (
    sharedTags * TAG_WEIGHT +
    (sameBrand ? BRAND_WEIGHT : 0) +
    priceCloseness * PRICE_WEIGHT +
    (candidate.rating / MAX_RATING) * RATING_WEIGHT -
    (candidate.stock === 0 ? OUT_OF_STOCK_PENALTY : 0)
  );
}

export function rankSimilarProducts(
  target: SimilarCandidate,
  candidates: SimilarCandidate[],
  limit: number,
): SimilarCandidate[] {
  return candidates
    .filter(candidate => candidate.id !== target.id)
    .map(candidate => ({ candidate, score: getScore(target, candidate) }))
    .sort((a, b) => b.score - a.score || a.candidate.id - b.candidate.id)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
