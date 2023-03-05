import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  Tooltip,
  useTheme
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { Recipe } from '../types/recipe'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_RECIPE } from '../mutations/recipeMutations'
import { GET_RECIPES } from '../queries/recipeQueries'
import { useNavigate } from 'react-router-dom'
import { RecipeType } from '../types/recipeType'
import { GET_INGREDIENTS } from '../queries/ingredientQueris'
import { Ingredient } from '../types/ingredient'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export default function EditRecipe({
  recipe,
  userId
}: {
  recipe: Recipe
  userId: number
}) {
  const { loading, data, error } = useQuery<{ getIngredients: Ingredient[] }>(
    GET_INGREDIENTS,
    {
      variables: { userId }
    }
  )
  const allIngredients = data?.getIngredients
  const originIngredients = recipe.ingredients.map((item) => item.name)
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(recipe.name)
  const [type, setType] = useState(recipe.type)
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl)
  const [steps, setSteps] = useState(recipe.steps)
  const [ingredients, setIngredients] = useState<string[]>(
    originIngredients ? originIngredients : []
  )
  const [isInvalidName, setIsInvalidName] = useState(false)
  const [isInvalidUrl, setIsInvalidUrl] = useState(false)
  const [isInvalidType, setIsInvalidType] = useState(false)
  const navigate = useNavigate()
  const [updateRecipe] = useMutation<{ updateRecipe: Recipe }>(UPDATE_RECIPE)

  const resetState = () => {
    setName(recipe.name)
    setType(recipe.type)
    setImageUrl(recipe.imageUrl)
    setSteps(recipe.steps)
    setIsInvalidName(false)
    setIsInvalidType(false)
    setIsInvalidUrl(false)
    setIngredients(originIngredients ? originIngredients : [])
  }

  const handleEditRecipe = async () => {
    let canEdit = true

    if (name.length === 0) {
      canEdit = false
      setIsInvalidName(true)
    } else {
      setIsInvalidName(false)
    }

    if (type.length === 0) {
      canEdit = false
      setIsInvalidType(true)
    } else {
      setIsInvalidType(false)
    }

    if (imageUrl.length === 0) {
      canEdit = false
      setIsInvalidUrl(true)
    } else {
      setIsInvalidUrl(false)
    }

    if (canEdit) {
      const selectedIngredients = allIngredients?.filter((item) => {
        return ingredients.includes(item.name)
      })
      const selectedIds = selectedIngredients?.map((item) => {
        return { id: item.id }
      })
      const updateRecipeInput = {
        id: recipe.id,
        name,
        type,
        imageUrl,
        steps,
        ingredients: selectedIds
      }

      try {
        await updateRecipe({
          variables: { updateRecipeInput },
          refetchQueries: [{ query: GET_RECIPES, variables: { userId } }]
        })
        setOpen(false)
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token')
          alert('トークンの有効期限が切れました。サインイン画面に遷移します。')
          navigate('/signin')
          return
        }

        alert('レシピーの編集に失敗しました')
      }
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    resetState()
    setOpen(false)
  }

  const handleChange = (event: SelectChangeEvent<typeof ingredients>) => {
    const {
      target: { value }
    } = event
    setIngredients(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <div>
      <Tooltip title="編集">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Recipe Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Recipe Type"
              onChange={(e) => setType(e.target.value as RecipeType)}
            >
              <MenuItem value={'MEAT'}>荤菜</MenuItem>
              <MenuItem value={'VEGETABLE'}>蔬菜</MenuItem>
              <MenuItem value={'MIX'}>混合</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="normal"
            id="image"
            label="Image Url"
            fullWidth
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-multiple-chip-label">Ingredient</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={ingredients}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {allIngredients &&
                allIngredients.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.name}
                    style={getStyles(item.name, ingredients, theme)}
                  >
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditRecipe}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
