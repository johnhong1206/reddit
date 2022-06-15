import React from 'react'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import {
  GET_POSTS_BY_POST_USERNAME,
  GET_USER_BY_USERNAME,
} from '../../graphql/queries'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Post from '../../components/Post'
import { Jelly } from '@uiball/loaders'
import Avatar from '../../components/Avatar'

function UserProfile() {
  const { data: session } = useSession()

  const router = useRouter()
  const { data: userdata } = useQuery(GET_USER_BY_USERNAME, {
    returnPartialData: true,
    variables: { username: router.query.username as string },
  })
  const { data: postdata } = useQuery(GET_POSTS_BY_POST_USERNAME, {
    variables: {
      username: router?.query?.username,
    },
  })

  const posts: Post[] = postdata?.getPostListByUsername
  const userprofile: [User] = userdata?.getUserByUserName

  console.log('userprofile', userprofile)

  if (!userprofile)
    return (
      <div className=" flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>ZH Reddit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col-reverse justify-evenly lg:flex-row">
        <div className="flex flex-col space-y-4">
          {posts && posts?.map((post) => <Post key={post.id} post={post} />)}
        </div>
        {userprofile ? (
          <div className="mb-10 bg-white p-10">
            {userprofile.map((profile: User) => (
              <div>
                <Avatar large />
                <h1>{profile.username}</h1>
                <p>{profile.bio}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex w-full items-center justify-center p-10 text-xl">
            <Jelly size={50} color="#FF4501" />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
