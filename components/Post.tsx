import {
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from '@heroicons/react/outline'
import { ArrowDownIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import {
  GET_VOTE_BY_POST_ID,
  GET_VOTE_BY_POST_ID_AND_USERNAME,
} from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'
import { useRouter } from 'next/router'
import client from '../apollo-client'

type Props = {
  post: Post
}

function Post({ post }: Props) {
  const router = useRouter()
  const { data: session } = useSession()

  const [vote, setVote] = useState<boolean>()
  const [votenumber, setVotenumber] = useState<Number>(0)
  const { data: votedata } = useQuery(GET_VOTE_BY_POST_ID_AND_USERNAME, {
    variables: {
      post_id: router.query.postId,
      username: session?.user?.name,
    },
  })

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTE_BY_POST_ID],
  })

  const upVote = async (isUpVote: boolean) => {
    const notification = toast.loading('...')

    if (!session?.user) {
      toast(' You need to be logged in to vote!')
      return
    }

    if (vote && isUpVote) return
    if (vote === false && !isUpVote) return

    try {
      const {
        data: { getVotesByPostIdandUsername },
      } = await client.query({
        query: GET_VOTE_BY_POST_ID_AND_USERNAME,
        variables: {
          post_id: post.id,
          username: session?.user?.name,
        },
      })
      const havevote = getVotesByPostIdandUsername != null

      if (havevote) {
        await addVote({
          variables: {
            post_id: post.id,
            username: session?.user?.name,
            upvote: isUpVote,
          },
        })
      }
      if (!havevote) {
        await addVote({
          variables: {
            post_id: post.id,
            username: session?.user?.name,
            upvote: isUpVote,
          },
        })
      }
      toast.success('vote', { id: notification })
    } catch (err) {
      console.log(err)
      toast.error('error')
    }
  }

  const { data, loading } = useQuery(GET_VOTE_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  })

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId

    const vote = votes?.find(
      (vote) => vote.username === session?.user?.name
    )?.upvote
    setVote(vote)
  }, [data])
  const votess: Vote[] = data?.getVotesByPostId

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId
    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    )
    setVotenumber(Number(displayNumber))

    if (votes?.length <= 0) return setVotenumber(Number(0))

    if (displayNumber <= 0) {
      setVotenumber(Number(0))
    }
  }, [data])

  console.log('votenumber', votenumber)

  // const displayVotes = (data: any) => {
  //   const votes: Vote[] = data?.getVotesByPostId
  //   const displayNumber = votes?.reduce(
  //     (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
  //     0
  //   )

  //   if (votes?.length === 0) return 0

  //   if (displayNumber === 0) {
  //     return votes[0].upvote ? 1 : -1
  //   }

  //   return displayNumber
  // }
  if (!post)
    return (
      <div className=" flex w-full items-center justify-center p-10 text-xl">
        <Jelly size={50} color="#FF4501" />
      </div>
    )

  return (
    <Link href={`/post/${post.id}`}>
      <div className=" hidden-sm flex cursor-pointer rounded-md border border-gray-300 bg-white hover:border hover:border-gray-600">
        {/* votes */}
        <div className=" flex flex-col items-center justify-start space-y-1  rounded-l-md bg-gray-50  p-4 text-gray-400">
          <ArrowUpIcon
            className={` voteButtons hover:text-red-400 ${
              vote && 'text-red-400'
            } `}
            onClick={() => upVote(true)}
          />
          <p className=" text-xs font-bold text-black">{votenumber}</p>
          <ArrowDownIcon
            className={` voteButtons hover:text-blue-400 ${
              !vote && 'text-blue-400'
            } `}
            onClick={() => upVote(false)}
          />
        </div>

        <div className="p-3 pb-1">
          {/* header */}

          <div className=" flex items-center space-x-2">
            <div>
              <Avatar seed={post?.subreddit[0]?.topic} />
            </div>

            <p className="text-xs text-gray-400  ">
              <Link href={`/subreddit/${post?.subreddit[0]?.topic}`}>
                <span className=" font-bold text-black hover:text-blue-400 hover:underline">
                  r/{post?.subreddit[0]?.topic}
                </span>
              </Link>
              <span className="ml-1">by /u</span>
              <Link href={`/userprofile/${post?.username}`}>
                <span className=" hover:text-blue-400 hover:underline">
                  {' ' + post.username}
                </span>
              </Link>
              <span className="ml-1">
                - Posted <TimeAgo date={post.created_at} />
              </span>
            </p>
          </div>

          {/* body */}
          <div className=" py-4">
            <h2 className=" text-xl font-semibold">{post.title}</h2>
            <p className=" mt-2 text-sm font-light">{post.body}</p>
          </div>

          {/* image */}
          {post.image && (
            <img
              className="w-full object-contain"
              src={post.image}
              alt="image"
            />
          )}

          {/* footer */}
          <div className=" flex space-x-4 text-gray-400">
            <div className="postButtons">
              <ChatAltIcon className=" h-6 w-6" />
              <p className="">
                {post.comments.length}
                <span className="ml-1 hidden lg:inline-flex"> Comments</span>
              </p>
            </div>
            <div className="postButtons">
              <GiftIcon className=" h-6 w-6" />
              <p className="hidden lg:flex">Award</p>
            </div>
            <div className="postButtons">
              <ShareIcon className=" h-6 w-6" />
              <p className="hidden lg:flex">Share</p>
            </div>
            <div className="postButtons">
              <BookmarkIcon className=" h-6 w-6" />
              <p className="hidden lg:flex">Share</p>
            </div>
            <div className="postButtons">
              <DotsHorizontalIcon className=" h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Post
