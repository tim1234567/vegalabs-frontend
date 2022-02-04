export const isNonNullable = <T>(value: T): value is NonNullable<typeof value> => !!value;
