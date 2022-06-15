import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://redstone.stepzen.net/api/nonplussed-wombat/__graphql',
  headers: {
    Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN__KEY}`,
  },
  cache: new InMemoryCache(),
})

export default client
