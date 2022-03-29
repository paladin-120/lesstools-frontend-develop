export const newObject = (object: any) => {
  try {
    if (!object) return object;
    return JSON.parse(JSON.stringify(object));
  } catch (e) {
    console.error('newObject:', e);
    return {};
  }
};
