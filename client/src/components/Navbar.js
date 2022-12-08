import { Box, IconButton, Input, List, ListItem } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';

function Navbar() {
  const [ value, setValue ] = useState("")
  const [ showDrop, setShowDrop ] = useState(false)
  const [ screen, setScreen ] = useState("HOME")
  const { auth } = useContext(AuthContext)
  const { store } = useContext(GlobalStoreContext)
  const path = window.location.pathname

  useEffect(() => {
    if (path === '/all') {
      setScreen("ALL")
    } else if (path === '/users') {
      setScreen("USERS")
    } else {
      setScreen("HOME")
    }
  }, [path])


  const handleChange = (event) => {
    event.preventDefault()
    setValue(event.target.value);
  }

  const handleNameSort = () => {
    setShowDrop(false)
      store.sortBy(1)
  }

  const handlePublishSort = () => {
    setShowDrop(false)  
    store.sortBy(2)
  }

  const handleListenSort = () => {
    setShowDrop(false)
    store.sortBy(3)
  }

  const handleLikeSort = () => {
    setShowDrop(false)
    store.sortBy(4)
  }

  const handleDislikeSort = () => {
    setShowDrop(false)
    store.sortBy(5)
  }

  const handleCreateSort = () => {
    setShowDrop(false)
    store.sortBy(6)
  }

  const handleUpdateSort = () => {
    setShowDrop(false)
    store.sortBy(7)
  }

  const handleNameSort2 = () => {
    setShowDrop(false)
      store.sortBy(8)
  }

  const handleSubmit = () => {
  }

  return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{ margin: '0px 10px' }}>
              <IconButton variant="contained" href='/' disabled={!auth.loggedIn}>
                <HomeIcon disableRipple sx={{ fontSize: '32pt', color: (auth.loggedIn ? 'black' : 'gray'), padding: '0', cursor: 'pointer', border: (screen === "HOME" ? '2px solid green' : '') }} />
              </IconButton>
              <IconButton variant="contained" href='/all'>
                <GroupsIcon disableRipple sx={{ fontSize: '32pt', color: 'black', padding: '0', cursor: 'pointer', margin: '0px 10px', border: (screen === "ALL" ? '2px solid green' : '') }} />
              </IconButton>
              <IconButton variant="contained" href='/users'>
                <PersonIcon disableRipple sx={{ fontSize: '32pt', color: 'black', padding: '0', cursor: 'pointer', border: (screen === "USERS" ? '2px solid green' : '') }} />
              </IconButton>
          </Box>
          <Box component='form' noValidate onSubmit={handleSubmit}>
            <input onChange={handleChange}
                required
                id="search"
                label="Search"
                name="search"
                defaultValue={value}
                value={value}
                style={{ border: '1px solid black', marginTop: '5px', padding: '5px 10px', fontSize: '16pt', borderRadius: '15px' }}
                ></input>
          </Box>
          <Box sx={{ marginRight: '10px', cursor: 'pointer' }}>
              <IconButton variant="contained" onClick={() => setShowDrop(!showDrop)}>
                <MenuIcon disableRipple sx={{ fontSize: '32pt', color: 'black', padding: '0' }} />
              </IconButton>
                {screen === 'HOME' ? (
                  <List sx={{ position: 'absolute', width: '200px', backgroundColor: 'white', borderRadius: '10px', padding: '5px', opacity: (showDrop ? '1' : '0'), transition: 'all 0.3s ease-in-out' }}>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleNameSort2}>Name {'(A - Z)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleCreateSort}>Creation Date {'(Old - New)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleUpdateSort}>Last Edit {'(New - Old)'}</ListItem>
                  </List>
                ) : (
                  <List sx={{ position: 'absolute', width: '200px', backgroundColor: 'white', borderRadius: '10px', padding: '5px', opacity: (showDrop ? '1' : '0'), transition: 'all 0.3s ease-in-out' }}>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleNameSort}>Name {'(A - Z)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handlePublishSort}>Publish Date {'(Newest)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } } } onClick={handleListenSort}>Listens {'(High - Low)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleLikeSort}>Likes {'(High - Low)'}</ListItem>
                    <ListItem sx={{ padding: '0px 1px', "&:hover": { backgroundColor: 'lightgray' } }} onClick={handleDislikeSort}>Dislikes {'(High - Low)'}</ListItem>
                  </List>
                )}
          </Box>
      </Box>
  )
}

export default Navbar