export function checkIsAdmin(userData) {
  return userData?.access?.toLowerCase() === "admin";
}
export function checkHasPlant(userData) {
  return !!userData?.plant;
}
