const replaceAll = (t: string, s: string, r: string): string => t.replace(new RegExp(s, 'g'), r)
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export {
  replaceAll,
  capitalize
}
