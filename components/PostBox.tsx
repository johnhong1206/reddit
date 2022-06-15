import React from 'react'
import { useSession } from 'next-auth/react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC, GET_ALL_POSTS } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}
type Props = {
  subreddit?: string
}

function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formdata) => {
    const notification = toast.loading('Creating post...')
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formdata.subreddit,
        },
      })

      const subredditExists = getSubredditListByTopic.length > 0
      if (!subredditExists) {
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formdata.subreddit,
          },
        })

        const image = formdata.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formdata.postTitle,
            body: formdata.postBody,
            image,
            subreddit_id: newSubreddit.id,
            username: session?.user?.name,
          },
        })

        console.log(newPost)
      } else {
        const image = formdata.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formdata.postTitle,
            body: formdata.postBody,
            image,
            subreddit_id: getSubredditListByTopic[0].id,
            username: session?.user?.name,
          },
        })
        console.log(newPost)
      }

      setValue('postTitle', '')
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('subreddit', '')

      toast.success('Post created!', {
        id: notification,
      })
    } catch (error) {
      console.log(error)
      toast.error('Error creating post', {
        id: notification,
      })
    }
    console.log(formdata)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="  sticky top-20 z-50 rounded-md  border border-gray-300 bg-white p-2"
    >
      <div className=" spx3 flex  items-center">
        {/* Avatar */}
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          type="text"
          className=" flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a tilte'
              : 'Sign in to create a post'
          }
        />
        <PhotographIcon
          className={` h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && ' text-blue-300'
          }`}
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
        />
        <LinkIcon className={` h-6 cursor-pointer text-gray-300`} />
      </div>

      {!!watch('postTitle') && (
        <div className=" flex flex-col py-2">
          {/* body */}
          <div className=" flex items-center px-2">
            <p className=" min-w-[90px]">Body</p>
            <input
              className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              type="text"
              placeholder="Text {optional}"
            />
          </div>
          {!subreddit && (
            <div className=" flex items-center px-2">
              <p className=" min-w-[90px]">Subreddit</p>
              <input
                className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('subreddit', { required: true })}
                type="text"
                placeholder="Subreddit..."
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className=" flex items-center px-2">
              <p className=" min-w-[90px]">Image URL</p>
              <input
                className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                type="text"
                placeholder="Optional..."
              />
            </div>
          )}

          {/* errors */}
          {Object.keys(errors).length > 0 && (
            <div
              className=" space-y-2 p-2  text-red-500
         "
            >
              {console.log(errors)}
              {errors.postTitle?.type === 'required' && (
                <p className="">Post title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p className="">Subreddit is required</p>
              )}
            </div>
          )}
          {!!watch('postTitle') && (
            <button
              type="submit"
              className="   w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
