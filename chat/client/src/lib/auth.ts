import { jwtDecode } from 'jwt-decode'

const ACCESS_TOKEN_KEY = 'accessToken'
const API_URL = 'http://localhost:9000/api'

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getUser = (): string | null => {
  const token = getAccessToken()
  if (!token) {
    return null
  }
  return getUserFromToken(token)
}

export const login = async (
  username: string,
  password: string
): Promise<string | null> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  if (response.ok) {
    const { token } = await response.json()
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    return username
  }
  return null
}

export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

const getUserFromToken = (token: string): string => {
  const jwtPayload = jwtDecode(token)
  return jwtPayload.sub as string
}
