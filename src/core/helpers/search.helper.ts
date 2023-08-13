export function getWhereByCondition(search: string) {
  const [searchBy, value] = search.split(':');
  switch (searchBy) {
    case 'barCode':
      return { barCode: value };
    case 'id':
      return { id: parseInt(value, 10) };
    default:
      return {};
  }
}
