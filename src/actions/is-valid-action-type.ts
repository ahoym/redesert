import { ALL_API_LIFECYCLE_SUFFIXES } from './api-lifecycle-suffixes';

export default function isValidActionType(
  reducerNamespace: string,
  actionType: string
): boolean {
  const validPrefix: boolean = actionType.startsWith(reducerNamespace);
  const validSuffix: boolean = ALL_API_LIFECYCLE_SUFFIXES.some(suffix =>
    actionType.endsWith(suffix)
  );

  return validPrefix && validSuffix;
}
