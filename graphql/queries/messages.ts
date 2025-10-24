import { gql } from '@apollo/client';

export const GET_DIRECT_MESSAGES = gql`
  query DirectMessages($userId: String!, $limit: Int, $offset: Int) {
    directMessages(userId: $userId, limit: $limit, offset: $offset) {
      id
      senderId
      recipientId
      content
      type
      mediaUrl
      isRead
      readAt
      createdAt
      updatedAt
      sender {
        id
        first_name
        last_name
        username
      }
      recipient {
        id
        first_name
        last_name
        username
      }
    }
  }
`;

export const GET_MESSAGE_THREADS = gql`
  query MessageThreads {
    messageThreads {
      otherUser {
        id
        first_name
        last_name
        username
      }
      chatRoom {
        id
        name
      }
      lastMessage {
        id
        content
        type
        createdAt
        sender {
          id
          first_name
          last_name
        }
      }
      unreadCount
    }
  }
`;

export const SEND_DIRECT_MESSAGE = gql`
  mutation SendDirectMessage($input: SendMessageInput!) {
    sendDirectMessage(input: $input) {
      id
      senderId
      recipientId
      content
      type
      mediaUrl
      isRead
      createdAt
      updatedAt
      sender {
        id
        first_name
        last_name
        username
      }
      recipient {
        id
        first_name
        last_name
        username
      }
    }
  }
`;

export const MARK_DIRECT_MESSAGES_AS_READ = gql`
  mutation MarkDirectMessagesAsRead($userId: String!) {
    markDirectMessagesAsRead(userId: $userId)
  }
`;
