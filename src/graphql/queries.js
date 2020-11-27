/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      name
      city
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        city
        description
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserm = /* GraphQL */ `
  query GetUserm($id: ID!) {
    getUserm(id: $id) {
      id
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const listUserms = /* GraphQL */ `
  query ListUserms(
    $filter: ModelUsermFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        mission_id
        mission_topic
        percentage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
