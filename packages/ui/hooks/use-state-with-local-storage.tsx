import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const useStateWithLocalStorage = <T,>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const fromLocal = localStorage.getItem(key)
  const parsed = fromLocal ? JSON.parse(fromLocal) : fromLocal

  const [state, setState] = useState<T>(parsed || initialValue)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state])

  return [state, setState]
}
