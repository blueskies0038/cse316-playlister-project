import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { Button, List } from '@mui/material';
import SongCard from './SongCard';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import MUIDeleteModal from './MUIDeleteModal';
import { useHistory } from 'react-router-dom';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false)
    const { idNamePair, selected } = props;
    const history = useHistory()

    const handleCardClick = (event) => {
      event.stopPropagation()
      if (open) {
          store.selectList(null)
      } else {
          store.selectList(idNamePair._id)
      }
      setOpen(!open)
  }

  const handleButtonClick = (event, key) => {
      store.duplicatePlaylist()
  }

  function handlePublish() {
      store.publishList(idNamePair._id)
  }

  function handleAddNewSong() {
    store.addNewSong();
  }

  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
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
        backgroundColor: (idNamePair.isPublished ? (open ? '#D4AF37' : '#D4D4F5') : '#F0EAD6'),
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

    const published = new Date(idNamePair.updatedAt)

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(idNamePair._id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
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
                <Box sx={{ p: 1, flexGrow: 1, fontSize: '14pt', padding: '0px' }} onClick={handleToggleEdit} disableRipple>{idNamePair.name}</Box>
                <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px', padding: '0px' }}>
                  <IconButton sx={{ color: 'black', marginLeft: '30px' }} disableRipple>
                    <ThumbUpOffAltIcon/>
                    <span className='playlist-likes'>{idNamePair.likes.length}</span>
                  </IconButton>
                  <IconButton sx={{ color: 'black', marginLeft: '30px' }} disableRipple>
                    <ThumbDownOffAltIcon/>
                    <span className='playlist-likes'>{idNamePair.dislikes.length}</span>
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', padding: '8px 0px', color: 'blue' }}>
                <Box sx={{ p: 1, flexGrow: 1, padding: '0px', fontSize: '9pt' }} id={idNamePair.ownerName} onClick={onUserClick}>By: {idNamePair.ownerName}</Box>
              </Box>
              <List sx={songsStyle}>
                  { idNamePair.isPublished ? (
                    idNamePair.songs.map((song, index) => (
                      <ListItem sx={{backgroundColor: '#2c2f70', color: '#D4AF37'}}>{index + 1}. {song.title}</ListItem>
                    ))
                  ) : (
                    idNamePair.songs.map((song, index) => (
                      <SongCard sx={{backgroundColor: '#2c2f70', color: '#D4AF37'}} id={'playlist-song-' + (index)} key={'playlist-song-' + (index)} index={index} song={song}>{song.title}</SongCard>
                    ))
                  )}
                  { !idNamePair.isPublished && (
                    <Button
                        disabled={!store.canAddNewSong()}
                        id='add-song-button'
                        onClick={handleAddNewSong}
                        variant="contained"
                        sx={{ width: '100%', borderRadius: '15px', marginBottom: '10px' }}
                        >
                        <AddIcon />
                    </Button>
                  )}
              </List>
              {open && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}>
                <Box>
                  <Button 
                      sx={{ marginRight: '15px' }}
                      disabled={!store.canUndo()}
                      id='undo-button'
                      onClick={handleUndo}
                      variant="contained">
                          Undo
                  </Button>
                  <Button 
                      sx={{ marginRight: '15px' }}
                      disabled={!store.canRedo()}
                      id='redo-button'
                      onClick={handleRedo}
                      variant="contained">
                          Redo
                  </Button>
                </Box>
                <Box>
                  <Button
                    sx={{ marginRight: '15px' }}
                    onClick={handlePublish}
                  >
                        Publish
                  </Button>
                  <Button
                    sx={{ marginRight: '15px' }}
                    onClick={handleDeleteList}
                  >
                        Delete
                  </Button>
                  <Button
                    sx={{ marginRight: '15px' }}
                    onClick={handleButtonClick}
                  >
                        Duplicate
                  </Button>
                </Box>
              </Box>
              )}
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
            { modalJSX }
            <MUIDeleteModal />
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 32}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;