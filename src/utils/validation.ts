import {ClassConstructor, plainToClass} from "class-transformer";
import {validateSync, ValidationError} from "class-validator";

export const validateBody = (clazz: ClassConstructor<any>, item: any): { field: string, reason: string[] }[] => {
  const validationErrors = validateSync(plainToClass(clazz, item));
  if (validationErrors.length) {
    return validationErrors.map((item) => ({
      field: item.property,
      reason: item.constraints ? Object.keys(item.constraints).map((key) => item.constraints![key]) : []
    }))
  }
  return []
}