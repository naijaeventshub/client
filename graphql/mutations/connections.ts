import { gql } from '@apollo/client';

export const SEND_CONNECTION_REQUEST = gql`
  mutation SendConnectionRequest($input: SendConnectionRequestInput!) {
    sendConnectionRequest(input: $input) {
      id
      status
      message
      createdAt
    }
  }
`;

export const ACCEPT_CONNECTION_REQUEST = gql`
  mutation AcceptConnectionRequest($input: UpdateConnectionStatusInput!) {
    acceptConnectionRequest(input: $input) {
      id
      status
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

export const REJECT_CONNECTION_REQUEST = gql`
  mutation RejectConnectionRequest($input: UpdateConnectionStatusInput!) {
    rejectConnectionRequest(input: $input) {
      id
      status
    }
  }
`;

export const REMOVE_CONNECTION = gql`
  mutation RemoveConnection($input: RemoveConnectionInput!) {
    removeConnection(input: $input)
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      id
      status
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($input: UnblockUserInput!) {
    unblockUser(input: $input)
  }
`;
