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

export function createFakeTask(name: string, startTime: string ){
  let ttl = random_number(200, 999)
  let task_error = 0
  let export_error = 0

  if(2 === random_number(0,4)){
      export_error = random_number(0,40)
  }

  if(3 === random_number(0,5)){
      task_error = random_number(0,20)
  }
  task_error += export_error

  let newDoc = ttl - random_number(0,50)
  let seen = ttl - task_error + export_error
  
  if(name === ''){
    name = ['files_copy', 'example', 'user_topics'][random_number(0,3)]
  }

  let start_time =  new Date()
  if(startTime === ''){
    start_time.setDate(start_time.getDate() - random_number(12,33))
    start_time.setMinutes(start_time.getMinutes() - random_number(23,93))
  }
  
  let end_time = new Date(start_time)
  end_time.setMinutes(end_time.getMinutes() + random_number(20,90))

  let m = {
    "id": random_number(600,99999),
    "name": name,
    "start_time": `${start_time.toISOString().split('T')[0]} ${start_time.toLocaleTimeString()}`,
    "end_time": `${end_time.toISOString().split('T')[0]} ${end_time.toLocaleTimeString()}`,
    "status": "complete",
    "count_total": ttl,
    "count_seen": seen,
    "count_new": newDoc,
    "count_differ": random_number(0,99),
    "count_delete": random_number(0,99),
    "count_task_error": task_error,
    "count_export_error": export_error,
    "last_doc_id": `${name.slice(0, 4)}_${random_number(653,345)}`
  }
  return m
}
