import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Recipe } from '../types/recipe'
import EditRecipe from './EditRecipe'
import DeleteRecipe from './DeleteRecipe'
import { Ingredient } from '../types/ingredient'
import { Box, Chip } from '@mui/material'

const theme = createTheme()

export default function Album({
  items,
  userId
}: {
  items: Recipe[] | undefined
  userId: number
}) {
  const chips = (ingredients: Ingredient[]) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {ingredients.map((item: Ingredient) => (
          <Chip key={item.id} label={item.name} variant="outlined" />
        ))}
      </Box>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container>
          {/* End hero unit */}
          <Grid container spacing={4}>
            {items &&
              items.map((item: Recipe) => (
                <Grid item key={item.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.imageUrl}
                      sx={{ minHeight: '300px' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {item.name}
                      </Typography>
                      {chips(item.ingredients)}
                    </CardContent>
                    <CardActions>
                      <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end"
                      >
                        <EditRecipe recipe={item} userId={userId} />
                        <DeleteRecipe id={item.id} userId={userId} />
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  )
}
