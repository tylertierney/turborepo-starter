//@ts-ignore
import './pinging-dot.css'
import { cn } from '../../lib/utils'
import { ComponentProps } from 'react'

export const PingingDot = ({
  width = '1em',
  height = '1em',
  className,
  ...rest
}: ComponentProps<'svg'>) => {
  // return <div className={cn('ping', className)} {...rest}></div>

  return (
    <svg
      className={cn('ping-svg', className)}
      {...rest}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <circle className="ping-ring" cx="32" cy="32" r="10" />

      <circle className="ping-core" cx="32" cy="32" r="10" />
    </svg>
  )
}
