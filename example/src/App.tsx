import React from 'react'

// Libraries
import ReactJwtApiAdapter, { useJwtApiAdapter } from 'react-jwt-api-adapter'

const App = () => {
  return (
    <ReactJwtApiAdapter
      baseUrl='http://localhost:8000/api/v1'
      token={
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMDg0MTI5LTYyNDctNDUyNS1iMDMxLTdmZGNhZGQxMjllYiIsImVtYWlsIjoibGVubmFydEB1d2J1c2luZXNzb25saW5lLm5sIiwicm9sZXMiOnsiZ2VuZXJhbCI6WyJhZG1pbiJdLCJjb21wYW5pZXMiOnt9fSwicGVybWlzc2lvbnMiOnsiZ2VuZXJhbCI6WyJtLmFkbWluIiwidi5kYXNoYm9hcmQiLCJ2LmNvbm5lY3Rpb25zIiwidi50b29scyIsInYuY29tcGFueSIsIm0uY29tcGFueSIsInYuY29tcGFueS1jbGllbnRzIiwibS5jb21wYW55LWNsaWVudHMiLCJ2LmNvbXBhbnktZW1wbG95ZWVzIiwibS5jb21wYW55LWVtcGxveWVlcyIsInYuaGVscCIsInYuZmVlZCJdLCJjb21wYW5pZXMiOnt9fSwiaWF0IjoxNjEwMzc5ODY2LCJleHAiOjE2MTAzODM0NjYsImF1ZCI6Im15YWxscGFydHMubmwiLCJpc3MiOiJhdXRoLm15YWxscGFydHMubmwiLCJzdWIiOiJmYzA4NDEyOS02MjQ3LTQ1MjUtYjAzMS03ZmRjYWRkMTI5ZWIifQ.NZfIVPYeVIs-tU2MHWk7tWak0G3iOHPLgRBkwXfi_DNO6ZwRFzlM5IFxleUwEs-WP002qu4KGUkGeF9Edtor97Vblc4hsz_HvGwwG0KLM5vrFNRQA7ee0D2bKY2A3R_Npi0PufU10D63t7LJNd8aBxsGk8psK4bQ55SVki93LzI'
      }
      updateToken={async () => {
        return 'eyJhbGciOiJSUzI1NiIsInR5cCI6Ikp.eyJpZCI6ImZjMDg0MTI5LTYyNDctNDUyNS1iMDMxLTdmZGNhZGQxMjllYiIsImVtYWlsIjoibGVubmFydEB1d2J1c2luZXNzb25saW5lLm5sIiwicm9sZXMiOnsiZ2VuZXJhbCI6WyJhZG1pbiJdLCJjb21wYW5pZXMiOnt9fSwicGVybWlzc2lvbnMiOnsiZ2VuZXJhbCI6WyJtLmFkbWluIiwidi5kYXNoYm9hcmQiLCJ2LmNvbm5lY3Rpb25zIiwidi50b29scyIsInYuY29tcGFueSIsIm0uY29tcGFueSIsInYuY29tcGFueS1jbGllbnRzIiwibS5jb21wYW55LWNsaWVudHMiLCJ2LmNvbXBhbnktZW1wbG95ZWVzIiwibS5jb21wYW55LWVtcGxveWVlcyIsInYuaGVscCIsInYuZmVlZCJdLCJjb21wYW5pZXMiOnt9fSwiaWF0IjoxNjEwMzYxNjkwLCJleHAiOjE2MTAzNjUyOTAsImF1ZCI6Im15YWxscGFydHMubmwiLCJpc3MiOiJhdXRoLm15YWxscGFydHMubmwiLCJzdWIiOiJmYzA4NDEyOS02MjQ3LTQ1MjUtYjAzMS03ZmRjYWRkMTI5ZWIifQ.EqqlHjK4-a5PX9YoVz6pFk86wnF7_Szl_w3QEUTaBhaO8_FIR5oCyVesbhsKq73mYbPJgph0A0DYh7lo5SeUUGg3zTn0QtL1bVA_yhFXOV8gy_VZ5LfuaNNXbF9rmr2VhvnbLZCvWZquEoQi2lhLkfmzHKYCTzIXXIHzyulQTS8'
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
          {
            method: 'GET'
          },
          async (url: string, settings: Object) => {
            const interceptorResponse = await adapter.requestApi(url, settings)

            return interceptorResponse
          }
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
