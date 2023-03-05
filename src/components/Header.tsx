import { useState, useRef } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'

export default function Header() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }
  // メニューの開閉を管理
  const [open, setOpen] = useState<boolean>(false)
  // メニューを配置するHTML要素を格納する
  const anchorEl = useRef<HTMLButtonElement>(null)
  // メニュー開閉ハンドル
  const handleClick = () => {
    setOpen(!open)
  }
  // メニューを閉めるハンドル
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <>
            <IconButton
              ref={anchorEl}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              // ここでボタンの位置にメニューを紐づける
              // この紐づけのお陰でメニューがボタンの隣に出現する
              // これが無いと画面の変なところでメニューが出現することになる
              anchorEl={anchorEl.current}
              // メニューの出現を管理
              open={open}
              // Falseだと、メニューを開いた時にメニューアイテムがフォーカスの対象になる
              disableAutoFocusItem={false}
              // Trueだとメニューが開いた時に一番上のメニューアイテムのオートフォーカスされる
              autoFocus={false}
              // 主にメニューを閉めたいときに発生するイベント
              onClose={handleClose}
              // Trueにすると、メニューが閉じている状態でもメニューのノードが存在するようになる
              keepMounted
              // メニューの開閉のアニメーション速度を設定できる
              transitionDuration={'auto'}
              // CSS in JS を記述できる(HTMLのstyle属性の役割を果たす)
              sx={{}}
              // 紐づけたHTML要素のどこを標準位置にしてメニューを配置するか設定できる
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              // メニューの起点を設定できる。アニメーションもこの起点から生えるように出現する
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              // Menuコンポーネント内部で使用されているMenuListコンポーネントのPropsを変更できる
              MenuListProps={{}}
              // Menuコンポーネント内部で使用されているPaperコンポーネントのPropsを変更できる
              PaperProps={{
                // PaperProps.elevationはメニューのシャドーを調整できる（超重要！）
                elevation: 3
              }}
            >
              <MenuItem onClick={handleClose}>メニュー１</MenuItem>
              <MenuItem onClick={handleClose}>メニュー２</MenuItem>
              <MenuItem onClick={handleClose}>メニュー３</MenuItem>
            </Menu>
          </>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: '20px' }}
          >
            My Recipe
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
