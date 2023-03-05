import { useQuery } from '@apollo/client'
import { Stack, Typography } from '@mui/material'
import jwtDecode from 'jwt-decode'
import React from 'react'
import AddRecipe from '../components/AddRecipe'
import Header from '../components/Header'
import Loading from '../components/Loading'
import RecipeTable from '../components/RecipeTable'
import TodayRecipes from '../components/TodayRecipes'
import { GET_RECIPES } from '../queries/recipeQueries'
import { Payload } from '../types/payload'
import { Recipe } from '../types/recipe'

export const Main = (): any => {
  const token = localStorage.getItem('token')
  const decodedToken = jwtDecode<Payload>(token!)
  const userId = decodedToken.sub

  const { loading, data, error } = useQuery<{ getRecipes: Recipe[] }>(
    GET_RECIPES,
    {
      variables: { userId }
    }
  )
  return (
    <>
      <Header />
      <Stack spacing={4} direction="column" mt={8} alignItems="center">
        {loading && <Loading />}
        {error && <Typography color="red">エラーが発生しました</Typography>}
        {!loading && !error && (
          <>
            <AddRecipe userId={userId} />
            <TodayRecipes items={data?.getRecipes} />
            <RecipeTable items={data?.getRecipes} userId={userId} />
          </>
        )}
      </Stack>
    </>
  )
}
