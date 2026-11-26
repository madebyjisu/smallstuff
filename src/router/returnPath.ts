import { paths } from './paths'

export function getReturnPath(state: unknown): string {
  if (!state || typeof state !== 'object' || !('returnTo' in state)) return paths.my

  const { returnTo } = state
  if (typeof returnTo !== 'string' || !returnTo.startsWith('/') ||
      returnTo.startsWith('//') || returnTo.includes('\\') ||
      [...returnTo].some(character => character.charCodeAt(0) <= 32)) return paths.my

  return returnTo
}
