import type { NextPage, GetServerSideProps } from 'next'

import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import { useQuery, useMutation } from '@apollo/client'
import SubredditRow from '../components/SubredditRow'
import {
  GET_SUBREDDIT_WITH_LIST,
  GET_USER_BY_USERNAME,
} from '../graphql/queries'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import client from '../apollo-client'
import { ADD_USER_PROFILE } from '../graphql/mutations'
import toast from 'react-hot-toast'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIST, {
    variables: {
      limit: 10,
    },
  })
  const subreddits: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>ZH Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox />
      <div className=" flex">
        <Feed />
        <div className=" sticky top-36  mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className=" text-md mb-1 p-4 pb-3 font-bold">Top Community</p>
          <div>
            {/* List subreddit */}

            {subreddits?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                topic={subreddit.topic}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
