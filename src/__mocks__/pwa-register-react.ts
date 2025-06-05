export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as [boolean, (v: boolean) => void],
    updateServiceWorker: () => {},
  }
}
