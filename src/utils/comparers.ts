export const is = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

// filter unique objects by pair id
export const uniqueArrayOfObjectsByKey = (array: any[], key: string) => {
  return array.filter((item: any, index: number, self: any[]) => {
    try {
      return self.findIndex((item2: any) => item2[key] === item[key]) === index;
    } catch (e) {
      console.error('uniqueArrayOfObjectsByKey:', e);
      return false;
    }
  });
}

export const uniqueArrayOfObjectsByKeyOfChild = (array: any[], key: string, key2: string) => {
  return array.filter((item: any, index: number, self: any[]) => {
    try {
      return self.findIndex((item2: any) => item2[key][key2] === item[key][key2]) === index;
    } catch (e) {
      console.error('uniqueArrayOfObjectsByKeyOfChild:', e);
      return false;
    }
  });
}
