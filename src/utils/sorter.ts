// TODO: to describe an util func
// ascending = 1 or 2

function sorter(
  a: any,
  b: any,
  key: string,
  sortCount: number,
  sortType: 'string' | 'date' | 'number' | 'tokenPrice',
  isUsd: boolean,
): number {
  const ascending = sortCount === 2;

  switch (sortType) {
    case 'string': {
      if (a[key] < b[key]) return ascending ? -1 : 1;
      if (a[key] > b[key]) return ascending ? 1 : -1;
      return 0;
    }

    case 'date': {
      const res = new Date(a[key]).getTime() - new Date(b[key]).getTime();
      return ascending ? -res : res;
    }

    case 'number': {
      const res = a[key] - b[key];
      return ascending ? res : -res;
    }

    case 'tokenPrice': {
      const res = isUsd ? a[key].usd - b[key].usd : a[key].eth - b[key].eth;
      return ascending ? res : -res;
    }
    default:
      return 0;
  }
}

export { sorter };
