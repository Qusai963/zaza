export function getWhereByCondition(search: string, parentCategoryId: number) {
  if (parentCategoryId === -1) {
    const [searchBy, value] = search.split(':');
    switch (searchBy) {
      case 'barCode':
        return { barCode: value };
      case 'id':
        return { id: parseInt(value, 10) };
      default:
        return {};
    }
  } else {
    return { parentCategoryId };
  }
}
