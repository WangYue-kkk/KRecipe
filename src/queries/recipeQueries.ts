import { gql } from '@apollo/client'

export const GET_RECIPES = gql`
  query getRecipes($userId: Int!) {
    getRecipes(userId: $userId) {
      id
      name
      type
      imageUrl
      steps
      ingredients {
        id
        name
      }
    }
  }
`
