import { Box, List } from '@mui/material';
import { useContext, useEffect, useSearchParams, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalStoreContext } from '../store'
import Comments from './Comments';
import PublishedListCard from './PublishedListCard';
import YouTubePlayer from './YouTubePlayer';

function UserListsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [ showPlayer, setShowPlayer ] = useState(true)
    const search = useLocation().search
    const searchParams = new URLSearchParams(search)
    const nameFilter = searchParams.get('search')

    useEffect(() => {
        store.loadPublishedIdNamePairs();
        if (nameFilter) {
          store.searchByUser(nameFilter)
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

export default UserListsScreen