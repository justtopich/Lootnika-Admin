import { useEffect, useRef } from 'react'
export * from './axios';


export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)
  
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])
  
    useEffect(() => {
      if (delay === null) {
        return
      }
  
      const id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }, [delay])
}

export function random_number(min: number, max: number){
  return Math.floor(Math.random() * (max - min)) + min;
}
