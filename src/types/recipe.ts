import { Ingredient } from './ingredient'
import { RecipeType } from './recipeType'

export type Recipe = {
  id: number
  name: string
  type: RecipeType
  imageUrl: string
  steps: string
  ingredients: Ingredient[]
}
