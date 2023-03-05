import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation } from '@apollo/client'
import { DELETE_RECIPE } from '../mutations/recipeMutations'
import { GET_RECIPES } from '../queries/recipeQueries'
import { useNavigate } from 'react-router-dom'

const DeleteRecipe = ({ id, userId }: { id: number; userId: number }) => {
  const [deleteRecipe] = useMutation<{ deleteRecipe: number }>(DELETE_RECIPE)
  const navigate = useNavigate()

  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipe({
        variables: { id },
        refetchQueries: [{ query: GET_RECIPES, variables: { userId } }]
      })
      alert('タスクが削除されました')
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token')
        alert('トークンの有効期限が切れました。サインイン画面に遷移します')
        navigate('/signin')
        return
      }
      alert('タスクの削除に失敗しました')
    }
  }

  return (
    <div>
      <Tooltip title="削除">
        <IconButton onClick={handleDeleteRecipe}>
          <DeleteIcon color="action" />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default DeleteRecipe
