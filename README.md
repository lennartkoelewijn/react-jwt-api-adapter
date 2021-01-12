# react-jwt-api-adapter

> React context provider for requesting API&#x27;s with expiring JWT&#x27;s. This provider checks the expiration date (exp variable when decoded) inside the JWT and runs the updateToken callback when validation fails. Using the updateToken callback you can request your authorization service for a new token so the next API call will succeed. This package relies on the jsonwebtoken dependency

[![NPM](https://img.shields.io/npm/v/react-jwt-api-adapter.svg)](https://www.npmjs.com/package/react-jwt-api-adapter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-jwt-api-adapter jsonwebtoken
```

## Usage

```tsx
import React from 'react'

// Libraries
import ReactJwtApiAdapter, { useJwtApiAdapter } from 'react-jwt-api-adapter'

const App = () => {
  return (
    <ReactJwtApiAdapter
      baseUrl='http://localhost:8000/api/v1'
      token={
        'eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp.eyJpZCI6ImZjMDg0MTI5LTYyNDctNDUyNS.NZfIVPYeVIs-tU2MHWk7tW'
      }
      updateToken={async () => {
        return 'eyJhbGciOiJSUzI1NiIsI.eyJpZCI6ImZjMDg0MTI5LTYyNDc.EqqlHjK4-a5PX9YoVz6pFk86wnF7_Szl_'
      }}
      leeway={5}
    >
      <Profile />
    </ReactJwtApiAdapter>
  )
}

const Profile = () => {
  const adapter: any = useJwtApiAdapter()
  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    const get = async () => {
      try {
        const response = await adapter.callApi(
          '/user',
          { method: 'GET' }
        )

        if (response.request.status === 200) {
          setUser(response.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    get()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      User: <br />
      {JSON.stringify(user)}
    </div>
  )
}

export default App
```

Or change the callApi to use the interceptor if you want to manipulate the request function before firing the fetch, this way you can add extra headers (for example)

```
const response = await adapter.callApi(
  '/user',
  {
    method: 'GET'
  },
  async (url: string, settings: Object) => {
    const interceptorResponse = await adapter.requestApi(url, settings)

    return interceptorResponse
  }
)
```

## Props

Common props you may want to specify:

- `baseUrl` - the base URL of the API
- `token` - the access token to start with
- `updateToken` - callback function for requesting a new access token
- `leeway` - optional number in seconds to account for a clock skew times difference between the signing and verifying servers

## Context data

Common data you may want to use inside the context:

- `token` - the given start access token
- `callApi` - function for calling the API with a middleware for checking the expiration date inside the JWT
- `requestApi` - immediately call the API without checking the JWT

## useJwtApiAdapter

Use the useJwtApiAdapter hook inside the provider to use the context data

## License

MIT © [lennartkoelewijn](https://github.com/lennartkoelewijn)
