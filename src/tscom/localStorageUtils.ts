// localStorageUtils.ts


// 從local取資料
export function getFromLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('取得失敗', error);
    return null;
  }
}

// 存入local
export function setToLocalStorage<T>(key: string, data: T): boolean {
  try {
    const item = JSON.stringify(data);
    localStorage.setItem(key, item);
    return true;
  } catch (error) {
    console.error('儲存失敗', error);
    return false;
  }
}
