import { ApolloProvider } from '@apollo/client'
import { useState } from 'react'
import { NavBar } from './components/Navbar'
import { LoginForm } from './components/LoginForm'
import { Chat } from './components/Chat'
import { getUser, logout } from './lib/auth'
import { apolloClient } from './lib/graphql/client'

const App = () => {
  const [user, setUser] = useState<string | null>(getUser)

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <ApolloProvider client={apolloClient}>
      <header>
        <NavBar user={user} onLogout={handleLogout} />
      </header>
      <main>
        {user ? <Chat user={user} /> : <LoginForm onLogin={setUser} />}
      </main>
    </ApolloProvider>
  )
}

export default App
