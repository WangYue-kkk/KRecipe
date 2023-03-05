import { gql } from '@apollo/client'

export const GET_INGREDIENTS = gql`
  query getIngredients($userId: Int!) {
    getIngredients(userId: $userId) {
      id
      name
    }
  }
`
