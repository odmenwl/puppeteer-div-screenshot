export function getFileName (str: string) {
  return str.replaceAll(' ', '-',)
    .replaceAll(':', '-')
    .replaceAll('\'', '-')
}

