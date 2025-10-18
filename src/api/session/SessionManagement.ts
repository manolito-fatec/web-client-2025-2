export function setSessionItem(keyName: string, value: string) {
  sessionStorage.setItem(keyName, value);
}

export function getSessionItem(keyName: string) {
  const value = sessionStorage.getItem(keyName);
  if (value === null) {
    return null;
  }
  return value;
}
