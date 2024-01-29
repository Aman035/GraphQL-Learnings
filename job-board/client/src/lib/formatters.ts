const LOCALE = navigator.language
const MEDIUM_FORMAT_DATE = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
})
const LONG_FORMAT_DATE = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' })

export const formatDate = (
  isoString: string,
  style: 'medium' | 'long' = 'medium'
): string => {
  const date = new Date(isoString)
  return style === 'long'
    ? LONG_FORMAT_DATE.format(date)
    : MEDIUM_FORMAT_DATE.format(date)
}
