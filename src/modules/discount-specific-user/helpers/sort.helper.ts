import { OrderByCondition } from 'typeorm';
export function getOrderDiscountSpecificUserByCondition(
  sort: string,
): OrderByCondition {
  switch (sort) {
    case 'newest':
      return { 'discountSpecificUser.createdAt': 'DESC' };
    case 'oldest':
      return { 'discountSpecificUser.createdAt': 'ASC' };
    default:
      return {};
  }
}
