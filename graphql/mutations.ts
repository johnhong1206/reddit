import { gql } from '@apollo/client'

export const ADD_USER_PROFILE = gql`
  mutation MyMutation(
    $username: String!
    $email: String!
    $bio: String!
    $profilepicture: String!
  ) {
    insertUser(
      username: $username
      email: $email
      bio: $bio
      profilepicture: $profilepicture
    ) {
      username
      email
      bio
      profilepicture
    }
  }
`

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String!
    $image: String!
    $subreddit_id: ID!
    $title: String!
    $username: String!
  ) {
    insertPost(
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      title: $title
      username: $username
    ) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
    }
  }
`

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`
export const ADD_COMMENT = gql`
  mutation MyMutatoin($post_id: ID!, $text: String!, $username: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      text
      created_at
      id
      post_id
      username
    }
  }
`
export const ADD_VOTE = gql`
  mutation MyMutatoin($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
      post_id
      username
      upvote
      created_at
    }
  }
`
