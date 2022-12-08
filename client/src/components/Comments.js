import { Box, IconButton, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useState } from 'react'
import AuthContext from '../auth';
import GlobalStoreContext from '../store';

function Comments(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [ value, setValue ] = useState("")


  const handleSubmit = (event) => {
    event.preventDefault()
    store.addComment(value)
    setValue("")
  }

  const boxStyle = {
    width: '480px',
    backgroundColor: '#D4D4F5',
    height: '100%',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    border: '1px solid black',
    position: 'relative'
  }

  return (
    <Box sx={boxStyle}>
      { store.selectedList ? (
        <Box sx={{ width: '100%', overflowY: 'scroll', height: '80%' }} component='form' noValidate onSubmit={handleSubmit}>
          {store.selectedList.comments.map((comment, index) => (
              <Box key={index} sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 5px',
                backgroundColor: '#D4AF37',
                borderRadius: '10px',
                border: "1px solid black",
                margin: "10px 5px",
              }}>
                <Box sx={{ marginBottom: '10px', fontSize: '9pt' }}>{comment.username}</Box>
                <Box>{comment.comment}</Box>
              </Box>
          ))}
          {auth.loggedIn && (
            <Box sx={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row' }}>
              <TextField
                  onChange={(newValue) => {
                    setValue(newValue.target.value);
                  }}
                  required
                  id="comment"
                  label="Add Comment"
                  name="comment"
                  defaultValue={value}
                  value={value}
                  sx={{
                    margin: "10px 5px",
                    width: '100%',
                  }}
              />
              <IconButton type='submit' onClick={handleSubmit}>
                  <SendIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  )
}

export default Comments