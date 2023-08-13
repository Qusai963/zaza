import { OrderByCondition } from 'typeorm';
export function getOrderByCondition(sort: string): OrderByCondition {
  switch (sort) {
    case 'newest':
      return { createdAt: 'DESC' };
    case 'oldest':
      return { createdAt: 'ASC' };
    default:
      return {};
  }
}
