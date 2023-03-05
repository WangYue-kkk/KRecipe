import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useMutation, useQuery } from '@apollo/client'
import { Recipe } from '../types/recipe'
import { GET_RECIPES } from '../queries/recipeQueries'
import { useNavigate } from 'react-router-dom'
import { CREATE_RECIPE } from '../mutations/recipeMutations'
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  useTheme
} from '@mui/material'
import { Ingredient } from '../types/ingredient'
import { GET_INGREDIENTS } from '../queries/ingredientQueris'

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

export default function AddRecipe({ userId }: { userId: number }) {
  const { loading, data, error } = useQuery<{ getIngredients: Ingredient[] }>(
    GET_INGREDIENTS,
    {
      variables: { userId }
    }
  )
  const allIngredients = data?.getIngredients

  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [steps, setSteps] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [isInvalidName, setIsInvalidName] = useState(false)
  const [isInvalidUrl, setIsInvalidUrl] = useState(false)
  const [isInvalidType, setIsInvalidType] = useState(false)
  const [createRecipe] = useMutation<{ createRecipe: Recipe }>(CREATE_RECIPE)
  const navigate = useNavigate()

  const resetState = () => {
    setName('')
    setType('')
    setImageUrl('')
    setSteps('')
    setIsInvalidName(false)
    setIsInvalidType(false)
    setIsInvalidUrl(false)
    setIngredients([])
  }

  const handleAddRecipe = async () => {
    let canAdd = true
    if (name.length === 0) {
      canAdd = false
      setIsInvalidName(true)
    } else {
      setIsInvalidName(false)
    }

    if (type.length === 0) {
      canAdd = false
      setIsInvalidType(true)
    } else {
      setIsInvalidType(false)
    }

    if (imageUrl.length === 0) {
      canAdd = false
      setIsInvalidUrl(true)
    } else {
      setIsInvalidUrl(false)
    }

    if (canAdd) {
      const selectedIngredients = allIngredients?.filter((item) => {
        return ingredients.includes(item.name)
      })
      const selectedIds = selectedIngredients?.map((item) => {
        return { id: item.id }
      })
      const createRecipeInput = {
        name,
        type,
        imageUrl,
        steps,
        userId,
        ingredients: selectedIds
      }
      try {
        await createRecipe({
          variables: { createRecipeInput },
          refetchQueries: [{ query: GET_RECIPES, variables: { userId } }]
        })
        resetState()
        setOpen(false)
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token')
          alert('トークンの有効期限が切れました。サインイン画面に遷移します。')
          navigate('/signin')
          return
        }

        alert('レシピーの登録に失敗しました')
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
      <Button
        variant="contained"
        sx={{ width: '270px' }}
        onClick={handleClickOpen}
      >
        Add Recipe
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Add Recipe</DialogTitle>
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
              onChange={(e) => setType(e.target.value)}
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
            label="Steps"
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
          <Button onClick={handleAddRecipe}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
