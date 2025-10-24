import { gql } from '@apollo/client';

export const GET_PENDING_REQUESTS = gql`
  query GetPendingRequests {
    pendingRequests {
      id
      requester {
        id
        first_name
        last_name
        email
      }
      message
      createdAt
    }
  }
`;

export const GET_SENT_REQUESTS = gql`
  query GetSentRequests {
    sentRequests {
      id
      recipient {
        id
        first_name
        last_name
        email
      }
      status
      message
      createdAt
    }
  }
`;

export const GET_ACCEPTED_CONNECTIONS = gql`
  query GetAcceptedConnections {
    acceptedConnections {
      id
      requester {
        id
        first_name
        last_name
      }
      recipient {
        id
        first_name
        last_name
      }
      createdAt
    }
  }
`;

export const GET_CONNECTIONS = gql`
  query GetConnections {
    connections {
      id
      requester {
        id
        first_name
        last_name
        email
      }
      recipient {
        id
        first_name
        last_name
        email
      }
      status
      createdAt
    }
  }
`;

export const CHECK_CONNECTION_STATUS = gql`
  query CheckConnectionStatus($userId: String!) {
    connectionStatus(userId: $userId) {
      id
      status
      requester {
        id
      }
      recipient {
        id
      }
    }
  }
`;
