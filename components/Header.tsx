import React, { useState } from 'react'
import Image from 'next/image'
import {
  BellIcon,
  ChevronDownIcon,
  GlobeIcon,
  HomeIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
  ChatIcon,
} from '@heroicons/react/outline'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/client'
import { ADD_USER_PROFILE } from '../graphql/mutations'
import { GET_USER_BY_USERNAME } from '../graphql/queries'
import toast from 'react-hot-toast'
import client from '../apollo-client'

function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const { data: session } = useSession()
  const [addProfile] = useMutation(ADD_USER_PROFILE, {
    refetchQueries: [GET_USER_BY_USERNAME, 'getUserByUserName'],
  })
  const { data } = useQuery(GET_USER_BY_USERNAME, {
    returnPartialData: true,
    variables: { username: session?.user?.name as string },
  })
  const userdata: User = data?.getUserByUserName
  const usernameExists = data?.getUserByUserName.length > 0

  const addUserData = async () => {
    const notification = toast.loading('Creating profile...')
    try {
      if (session) {
        const {
          data: { getUserByUserName },
        } = await client.query({
          query: GET_USER_BY_USERNAME,
          variables: {
            username: session?.user?.name as string,
          },
        })
        const usernameExists = getUserByUserName.length > 0
        if (!usernameExists) {
          const profileimage = (session.user?.image as string) || ''
          const email = (session.user?.email as string) || ''
          toast.success('Profile Not exist , Creating profile...', {
            id: notification,
          })
          const {
            data: { insertUser: newUser },
          } = await addProfile({
            variables: {
              username: session.user?.name as string,
              email: email,
              profilepicture: profileimage,
              bio: 'Please Add Bio',
            },
          })
        }
        toast.success('Profile created!', {
          id: notification,
        })
      }
    } catch (err) {
      console.log(err)
      toast.error('Error creating post', {
        id: notification,
      })
    }
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
          <Link href="/">
            <Image
              objectFit="contain"
              src="https://links.papareact.com/fqy"
              layout="fill"
            />
          </Link>
        </div>

        <div className="mx-7 flex items-center xl:min-w-[300px]">
          <HomeIcon className="h-5 w-5" />
          <p className="ml-2 hidden flex-1 lg:inline">Home</p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>

      {/* seach box */}

      <form className="hidden flex-1 items-center space-x-2 rounded-sm border-gray-200 bg-gray-100 px-3  lg:flex">
        <SearchIcon className="h-6 w-6 to-gray-400" />
        <input
          type="text"
          placeholder="Search Reddit"
          className=" flex-1 bg-transparent outline-none"
        />
        <button hidden type="submit" />
      </form>
      <div className="mx-5  hidden items-center space-x-2 text-gray-500 lg:inline-flex ">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="bdg-gray-100 h-10 border" />

        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SparklesIcon className="icon" />
      </div>
      <div className=" ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div>

      {/* signin signout */}
      {session ? (
        <div className="relative hidden lg:flex">
          <div
            onMouseOver={() => setShowDropdown(true)}
            className="cursor-pointer  items-center space-x-2 border border-gray-100 p-2 lg:flex"
          >
            <div className=" relative h-5 w-5 flex-shrink-0">
              <Image
                src="https://links.papareact.com/23l"
                layout="fill"
                alt=""
                objectFit="contain"
              />
            </div>
            <div className="flex-1 text-xs">
              <p className=" truncate">{session?.user?.name}</p>
            </div>
            <ChevronDownIcon className=" h-5 flex-shrink-0 text-gray-400" />{' '}
          </div>

          {showDropdown && (
            <div
              onMouseLeave={() => setShowDropdown(false)}
              className="absolute top-11 w-full cursor-pointer bg-white  text-center shadow-sm "
            >
              {usernameExists ? (
                <Link href={`/userprofile/${session?.user?.name}`}>
                  <div className="px-4 py-4 hover:shadow-lg">
                    <p className="text-sm font-bold">Profile</p>
                  </div>
                </Link>
              ) : (
                <div
                  onClick={addUserData}
                  className="px-4 py-4 hover:shadow-lg"
                >
                  <p className="text-sm font-bold">Add Profile</p>
                </div>
              )}
              <div
                className="px-4 py-4 hover:shadow-lg"
                onClick={() => signOut()}
              >
                <p className="text-sm font-bold">Sign Out</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className=" hidden cursor-pointer  items-center space-x-2 border border-gray-100 p-2 lg:flex"
        >
          <div className=" relative h-5 w-5 flex-shrink-0">
            <Image
              src="https://links.papareact.com/23l"
              layout="fill"
              alt=""
              objectFit="contain"
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  )
}

export default Header
