export function datesToString<T>(
  object: T & { createdAt: Date; updatedAt: Date },
) {
  return {
    ...object,
    createdAt: object.createdAt.toISOString(),
    updatedAt: object.updatedAt.toISOString(),
  };
}
