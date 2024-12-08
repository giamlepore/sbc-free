import { AccessLevel } from '@prisma/client'

export { AccessLevel }

export const MODULE_ACCESS: ModuleAccess = {
  [AccessLevel.LEAD]: [4],
  [AccessLevel.LEAD_PLUS]: [3, 4],
  [AccessLevel.STUDENT]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [AccessLevel.ADMIN]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

export interface ModuleAccess {
  [AccessLevel.LEAD]: number[];
  [AccessLevel.LEAD_PLUS]: number[];
  [AccessLevel.STUDENT]: number[];
  [AccessLevel.ADMIN]: number[];
}

export function hasModuleAccess(userLevel: AccessLevel, moduleIndex: number): boolean {
  if (userLevel === AccessLevel.ADMIN || userLevel === AccessLevel.STUDENT) return true;
  return MODULE_ACCESS[userLevel].includes(moduleIndex);
}