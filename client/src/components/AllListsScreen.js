import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import PublishedListCard from './PublishedListCard';
import YouTubePlayer from './YouTubePlayer';
import { Box, TextField } from '@mui/material';
import Comments from './Comments';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import { useLocation } from 'react-router-dom';

function AllListsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [ showPlayer, setShowPlayer ] = useState(true)
    const search = useLocation().search
    const searchParams = new URLSearchParams(search)
    const nameFilter = searchParams.get('search')

    useEffect(() => {
        store.loadPublishedIdNamePairs();
        if (nameFilter || nameFilter === '') {
          store.searchByName(nameFilter)
        }
    }, []);

    return (
      <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', height: '70%' }}>
        <List sx={{ width: '90%', bgColor: 'background.paper', overflowY: 'scroll', overflowX: 'hidden' }}>
        {
            store.publishedIdNamePairs.map((pair) => (
                <PublishedListCard
                    key={pair._id}
                    idNamePair={pair}
                />
            ))
        }
        </List>
        <Box sx={{ display: 'flex', p: 1, flexDirection: 'column', padding: '0px' }}>
            <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', padding: '0px' }}>
              <div className={showPlayer ? 'tab-button-active' : 'tab-button'} onClick={() => {setShowPlayer(true)}}>Player</div>
              <div className={showPlayer ? 'tab-button': 'tab-button-active'} onClick={() => {setShowPlayer(false)}}>Comments</div>
            </Box>
            {showPlayer ? (
                <YouTubePlayer />
            ) : (
                <Comments />
            )}
        </Box>
      </Box>
    )
}

export default AllListsScreen