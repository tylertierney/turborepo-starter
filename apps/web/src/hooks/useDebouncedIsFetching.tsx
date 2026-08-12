import { useEffect, useState } from 'react'

export const useDebouncedIsFetching = ({
  isFetching,
  delay = 100,
}: {
  isFetching: boolean
  delay?: number
}) => {
  const [showSpinner, setShowSpinner] = useState(isFetching)

  useEffect(() => {
    let timer: number

    if (isFetching) {
      timer = setTimeout(() => {
        setShowSpinner(true)
      }, delay)
    } else {
      setShowSpinner(false)
    }

    return () => clearTimeout(timer)
  }, [isFetching, delay])

  return showSpinner
}
