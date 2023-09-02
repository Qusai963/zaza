export function getWhereByCondition(search: string, parentCategoryId: number) {
  if (parentCategoryId === -1) {
    return {};
  } else {
    return { parentCategoryId };
  }
}
