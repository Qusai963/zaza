export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number,
): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100.');
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  const discountedPrice = originalPrice - discountAmount;

  return discountedPrice;
}
