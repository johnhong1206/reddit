import { gql } from '@apollo/client'

export const GET_USER_BY_USERNAME = gql`
  query MyQuery($username: String!) {
    getUserByUserName(username: $username) {
      username
      email
      profilepicture
      bio
    }
  }
`

export const GET_POSTS_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostListByPostId(post_id: $post_id) {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comments {
        text
        created_at
        id
        post_id
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        username
        upvote
      }
    }
  }
`

export const GET_SUBREDDIT_WITH_LIST = gql`
  query MyQuery($limit: Int!) {
    getSubredditListLimit(limit: $limit) {
      topic
      created_at
      id
    }
  }
`

export const GET_VOTE_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      created_at
      id
      post_id
      username
      upvote
    }
  }
`
export const GET_VOTE_BY_POST_ID_AND_USERNAME = gql`
  query MyQuery($post_id: ID!, $username: String!) {
    getVotesByPostIdandUsername(post_id: $post_id, username: $username) {
      created_at
      id
      post_id
      username
      upvote
    }
  }
`

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      topic
      created_at
      id
    }
  }
`

export const GET_POSTS_BY_POST_USERNAME = gql`
  query MyQuery($username: String!) {
    getPostListByUsername(username: $username) {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comments {
        text
        created_at
        id
        post_id
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        username
        upvote
      }
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comments {
        text
        created_at
        id
        post_id
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        username
        upvote
      }
    }
  }
`
export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      title
      subreddit_id
      username
      comments {
        text
        created_at
        id
        post_id
        username
      }
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        username
        upvote
      }
    }
  }
`
