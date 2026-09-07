export function countOwnedAccessory(id, accessories = [], pets = []) {
  const matches = item => (typeof item === 'string' ? item : item?.id) === id;
  return accessories.filter(matches).length + pets.reduce((count, pet) => count + (pet.equips || []).filter(matches).length, 0);
}
