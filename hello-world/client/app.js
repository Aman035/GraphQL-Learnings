// Script to handle the client side of the application

const fetchGreeting = async () => {
  /**
   * 1. HTTP Request to the server
   * GraphQL queries are mostly POST requests with a JSON body that contains the query param
   */
  const response = await fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'query { greeting }',
    }),
  })

  /**
   * 2. Parse the response to JSON Object and extract the greeting
   */
  const { data } = await response.json()
  const { greeting } = data

  /**
   * 3. Update the DOM with the greeting
   */
  document.getElementById('greeting').textContent = greeting
}

fetchGreeting()
