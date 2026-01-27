import type { Badge } from './types';

export const BADGE_RANKS: Badge[] = [
  { name: '씨앗', minPoints: 0, imageId: 'badge-seedling', emoji: '🌱' },
  { name: '새싹이', minPoints: 500, imageId: 'badge-sprout', emoji: '🌿' },
  { name: '무럭이', minPoints: 1000, imageId: 'badge-growing-plant', emoji: '🌳' },
  { name: '활짝이', minPoints: 1500, imageId: 'badge-blossom', emoji: '🌸' },
  { name: '주렁이', minPoints: 2000, imageId: 'badge-fruitful', emoji: '🍎' },
];
