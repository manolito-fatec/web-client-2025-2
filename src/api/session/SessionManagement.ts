export function setSessionItem(keyName: string, value: string|null) {
  if (!value) {
    return;
  }
  sessionStorage.setItem(keyName, value);
}

export function delSessionItem(keyName: string) {
  sessionStorage.removeItem(keyName);
}


export function getSessionItem(keyName: string) {
  const value = sessionStorage.getItem(keyName);
  if (value === null) {
    return null;
  }
  return value;
}
