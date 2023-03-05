import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GuestRoute, PrivateRoute } from './AuthRoute'
import { Main } from './pages/Main'
import { NotFound } from './pages/NotFound'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import client from './apolloClient'
import { ApolloProvider } from '@apollo/client'

const App = (): any => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={<GuestRoute children={<SignIn />} />}
          />
          <Route
            path="/signup"
            element={<GuestRoute children={<SignUp />} />}
          />
          <Route path="/" element={<PrivateRoute children={<Main />} />} />
          <Route path="*" element={<GuestRoute children={<NotFound />} />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
