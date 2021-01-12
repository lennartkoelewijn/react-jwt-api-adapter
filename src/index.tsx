import * as React from 'react'

// Libraries
import jwt from 'jsonwebtoken'

// Hooks
import useJwtApiAdapter from './hooks/useJwtApiAdapter'

export const Context = React.createContext({})

export { useJwtApiAdapter }

interface Props {
  baseUrl?: string
  token?: string
  leeway?: number
  children: any
  updateToken(): Promise<string>
}

interface Provider {
  token: string
  requestApi(settings?: Object): Promise<any>
  callApi(settings?: Object): Promise<any>
}

interface Settings {
  delay?: number
  method?: string
  [key: string]: any
}

interface Headers {
  [key: string]: string
}

const ReactJwtApiAdapter = ({
  baseUrl = '',
  token = '',
  updateToken,
  leeway = 5,
  children
}: Props) => {
  function isTokenExpired(token: string = ''): boolean {
    const decoded: any = jwt.decode(token)
    const now: number = Math.floor(new Date().getTime() / 1000)
    return now + leeway >= decoded.exp
  }

  function sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function requestApi(
    url: string = '',
    settings: Settings = {}
  ): Promise<any> {
    settings = { ...{ method: 'GET', delay: 0 }, ...settings }

    try {
      const startTimer: number = new Date().getTime()

      const headers: Headers = settings.headers || {}

      if (token) {
        headers.authorization = `Bearer ${token}`
      }

      const fetcher: any = await fetch(`${baseUrl}${url}`, {
        ...settings,
        ...{ headers }
      })
      const response: Object = await fetcher.json()

      const difference: number = new Date().getTime() - startTimer
      const delay: number = settings.delay || 0 - difference

      if (delay > 0) {
        await sleep(delay)
      }

      return { request: fetcher, data: response }
    } catch (error) {
      console.error(error)

      return { error }
    }
  }

  async function callApi(
    url: string = '',
    settings: Settings = {},
    interceptor?: any,
    retry: boolean = true
  ): Promise<any> {
    if (token) {
      const expired = isTokenExpired(token)

      if (expired && retry) {
        const newToken: string = await updateToken()

        token = newToken

        if (token) {
          const response = await callApi(
            url,
            { ...settings, ...{ delay: 0 } },
            interceptor,
            false
          )

          return response
        }
      }
    }

    let response: Promise<any>

    if (typeof interceptor === 'function') {
      response = await interceptor(url, settings)
    } else {
      response = await requestApi(url, settings)
    }

    return response
  }

  const data: Provider = {
    token,
    requestApi,
    callApi
  }

  return <Context.Provider value={data}>{children}</Context.Provider>
}

export default ReactJwtApiAdapter
