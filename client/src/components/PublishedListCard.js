import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useContext, useState } from 'react';
import { Button, IconButton, List } from '@mui/material';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useHistory } from 'react-router-dom';

function PublishedListCard(props) {
    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext);
    const history = useHistory()

    const [open, setOpen] = useState(false)
    const { idNamePair } = props;

    const published = new Date(idNamePair.updatedAt)

    const handleCardClick = async () => {
        if (open) {
            store.selectList(null)
        } else {
            store.selectList(idNamePair._id)
        }
        setOpen(!open)
    }

    const handleButtonClick = () => {
        store.duplicatePlaylist({ name: idNamePair.name, songs: idNamePair.songs})
    }

    const handleLikeClick = () => {
        store.updateLikes(idNamePair._id)
    }

    const handleDislikeClick = () => {
        store.updateDislikes(idNamePair._id)
    }

    const onUserClick = (event) => {
      const user = event.currentTarget.id
        history.push({
          pathname: '/users',
          search: `?search=${user}`
        })
    }

    const style = {
      display: 'flex',
      p: 1,
      flexDirection: 'column',
      alignItems:  'stretch',
      width: '100%',
    }

    const listStyle = {
        width: '100%',
        padding: '0px',
        border: '1px solid black',
        borderRadius: '15px',
        marginBottom: '5px',
        backgroundColor: (open ? '#D4AF37' : '#D4D4F5'),
        fontWeight: '700',
    }

    const songsStyle = {
        opacity: (open ? '1' : '0'),
        maxHeight: (open ? '200px' : '0px'),
        overflowY: 'scroll',
        padding: '0px',
        transition: 'all 0.4s ease',
        width: '95%',
        paddingLeft: '1%'
    }

    return (
      <ListItem
          id={idNamePair._id}
          key={idNamePair._id}
          sx={style}
          style={listStyle}
          button
          disableRipple
      >
          <Box sx={style}>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', padding: '0px' }}>
              <Box sx={{ p: 1, flexGrow: 1, fontSize: '14pt', padding: '0px' }}>{idNamePair.name}</Box>
              <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px', padding: '0px' }}>
                <IconButton sx={{ color: 'black', marginLeft: '30px' }} disableRipple onClick={handleLikeClick}>
                  <ThumbUpOffAltIcon/>
                  <span className='playlist-likes'>{idNamePair.likes.length}</span>
                </IconButton>
                <IconButton sx={{ color: 'black', marginLeft: '30px' }} disableRipple onClick={handleDislikeClick}>
                  <ThumbDownOffAltIcon/>
                  <span className='playlist-likes'>{idNamePair.dislikes.length}</span>
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', padding: '8px 0px', color: 'blue' }}>
              <Box sx={{ p: 1, flexGrow: 1, padding: '0px', fontSize: '9pt', cursor: 'pointer' }} id={idNamePair.ownerName} onClick={onUserClick}>
                By: {idNamePair.ownerName}
              </Box>
            </Box>
            <List sx={songsStyle}>
                { idNamePair.songs.map((song, index) => (
                    <ListItem sx={{backgroundColor: '#2c2f70', color: '#D4AF37'}}>{index + 1}. {song.title}</ListItem>
                )) }
            </List>
            <Box>
              {open && (
                <Button
                  sx={{ textAlign: 'right', marginRight: '25px', marginTop: '10px', float: 'right', backgroundColor: '#e3e3e3' }}
                  onClick={handleButtonClick}
                  disabled={!auth.loggedIn}
                >
                      Duplicate
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', padding: '0px', alignItems: 'center' }}>
              <Box sx={{ p: 1, flexGrow: 1, padding: '0px', fontSize: '9pt' }}>
                Published: 
                <span style={{ color: '#3BB143' }}>
                  {published.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}
                </span>
              </Box>
              <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px', padding: '0px', fontSize: '9pt' }}>
                Listens: <span id='playlist-listens'>{idNamePair.listens}</span>
                <IconButton sx={{ color: 'black', marginLeft: '30px' }} onClick={handleCardClick} disableRipple>
                  {open ? (
                    <KeyboardDoubleArrowUpIcon/>
                  ) : (
                    <KeyboardDoubleArrowDownIcon/>
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>    
      </ListItem>
    )
}

export default PublishedListCard