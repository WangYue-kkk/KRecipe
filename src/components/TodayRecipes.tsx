import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { Divider, Typography, useTheme } from '@mui/material'
import { Recipe } from '../types/recipe'
import { Ingredient } from '../types/ingredient'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 }
]

export default function TodayRecipes({
  items
}: {
  items: Recipe[] | undefined
}) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [lunchRecipes, setLunchRecipes] = useState('')
  const [dinnerRecipes, setDinnerRecipes] = useState('')

  const randomRecipes = () => {
    if (items) {
      const length = items.length
      const lunch1 = items[Math.floor(Math.random() * length)]
      const lunch2 = items[Math.floor(Math.random() * length)]
      const dinner1 = items[Math.floor(Math.random() * length)]
      const dinner2 = items[Math.floor(Math.random() * length)]
      setLunchRecipes([lunch1.name, lunch2.name].join(','))
      setDinnerRecipes([dinner1.name, dinner2.name].join(','))
      const newArr = [
        ...lunch1.ingredients,
        ...lunch2.ingredients,
        ...dinner1.ingredients,
        ...dinner2.ingredients
      ]
      const map = new Map()
      const result = newArr.filter(
        (item) => !map.has(item.id) && map.set(item.id, item.name)
      )
      setIngredients(result)
    }
  }
  const handleClickOpen = () => {
    randomRecipes()
    setOpen(true)
  }

  const handleClose = () => {
    setLunchRecipes('')
    setDinnerRecipes('')
    setIngredients([])
    setOpen(false)
  }

  return (
    <div>
      <Button
        variant="contained"
        sx={{ width: '270px' }}
        onClick={handleClickOpen}
      >
        What to eat today?
      </Button>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>What to eat today?</DialogTitle>
        <DialogContent>
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper'
            }}
          >
            <ListItem key={1}>
              <ListItemText primary="Lunch" secondary={lunchRecipes} />
            </ListItem>
            <ListItem key={2}>
              <ListItemText primary="Dinner" secondary={dinnerRecipes} />
            </ListItem>
          </List>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={ingredients} columns={columns} checkboxSelection />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={randomRecipes}>Random Again</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
