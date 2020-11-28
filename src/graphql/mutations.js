/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
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
export const createUserm = /* GraphQL */ `
  mutation CreateUserm(
    $input: CreateUsermInput!
    $condition: ModelUsermConditionInput
  ) {
    createUserm(input: $input, condition: $condition) {
      id
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const updateUserm = /* GraphQL */ `
  mutation UpdateUserm(
    $input: UpdateUsermInput!
    $condition: ModelUsermConditionInput
  ) {
    updateUserm(input: $input, condition: $condition) {
      id
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserm = /* GraphQL */ `
  mutation DeleteUserm(
    $input: DeleteUsermInput!
    $condition: ModelUsermConditionInput
  ) {
    deleteUserm(input: $input, condition: $condition) {
      id
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const createGoal = /* GraphQL */ `
  mutation CreateGoal(
    $input: CreateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    createGoal(input: $input, condition: $condition) {
      id
      name
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const updateGoal = /* GraphQL */ `
  mutation UpdateGoal(
    $input: UpdateGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    updateGoal(input: $input, condition: $condition) {
      id
      name
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
export const deleteGoal = /* GraphQL */ `
  mutation DeleteGoal(
    $input: DeleteGoalInput!
    $condition: ModelGoalConditionInput
  ) {
    deleteGoal(input: $input, condition: $condition) {
      id
      name
      mission_id
      mission_topic
      percentage
      createdAt
      updatedAt
    }
  }
`;
