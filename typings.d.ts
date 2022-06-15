type Comments = {
  created_at: string
  id: number
  post_id: number
  text: string
  username: string
}
type Vote = {
  created_at: string
  id: number
  post_id: number
  upvote: boolean
  username: string
}

type User = {
  username: String
  email: String
  bio: String
  profilepicture: String
}

type Subreddit = {
  created_at: string
  id: number

  topic: string
}

type Post = {
  created_at: string
  id: number
  subreddit_id: number
  body: string
  title: string
  votes: Vote[]
  comments: Comments[]
  image: string
  subreddit: Subreddit[]
  username: string
}
