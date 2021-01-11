import { useContext } from 'react'
import { Context } from '../index'

const useJwtApiAdapter = () => {
  const context = useContext(Context)

  return context
}

export default useJwtApiAdapter
