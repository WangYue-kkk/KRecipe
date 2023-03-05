import { gql } from '@apollo/client'

export const CREATE_RECIPE = gql`
  mutation createRecipes($createRecipeInput: CreateRecipeInput!) {
    createRecipe(createRecipeInput: $createRecipeInput) {
      id
      name
      type
      imageUrl
      steps
    }
  }
`

export const UPDATE_RECIPE = gql`
  mutation updateRecipe($updateRecipeInput: UpdateRecipeInput!) {
    updateRecipe(updateRecipeInput: $updateRecipeInput) {
      id
      name
      type
      imageUrl
      steps
    }
  }
`

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($id: Int!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`
