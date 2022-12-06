import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react';
import { List } from '@mui/material';

function PublishedListCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const [open, setOpen] = useState(false)
    const { idNamePair } = props;

    const handleClick = () => {
        setOpen(!open)
    }

    const style = {
      display: 'flex',
      p: 1,
      flexDirection: 'column',
      alignItems:  'stretch',
      transition: 'all 0.2s ease',
      width: '100%'
    }

    return (
      <ListItem
          id={idNamePair._id}
          key={idNamePair._id}
          sx={style}
          style={{ width: '100%' }}
          button
          onClick={handleClick}
      >
          <Box sx={style}>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', }}>
              <Box sx={{ p: 1, flexGrow: 1, fontSize: '18pt', fontWeight: '700'}}>{idNamePair.name}</Box>
              <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px' }}>likes</Box>
            </Box>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row' }}>
              <Box sx={{ p: 1, flexGrow: 1 }}>By: {idNamePair.ownerName}</Box>
              <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px' }}></Box>
            </Box>
            <List sx={{ opacity: (open ? '1' : '0'), maxHeight: (open ? '300px' : '0px'), overflowY: 'scroll' }}>
                { idNamePair.songs.map((song) => (
                    <ListItem>{song.title}</ListItem>
                )) }
                duplicate
            </List>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row' }}>
              <Box sx={{ p: 1, flexGrow: 1 }}>Published</Box>
              <Box sx={{ p: 1, flexGrow: 1, textAlign: 'right', marginRight: '20px' }}>Listens</Box>
            </Box>
          </Box>    
      </ListItem>
    )
}

export default PublishedListCard