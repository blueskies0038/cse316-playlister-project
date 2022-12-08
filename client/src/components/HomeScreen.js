import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import { useLocation } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import { Box } from '@mui/material';
import YouTubePlayer from './YouTubePlayer';
import Comments from './Comments';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [ showPlayer, setShowPlayer ] = useState(true)
    const search = useLocation().search
    const searchParams = new URLSearchParams(search)
    const nameFilter = searchParams.get('search')

    useEffect(() => {
        store.loadIdNamePairs();
        if (nameFilter) {
          store.searchByNamePrivate(nameFilter)
        }
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', bgColor: 'background.paper', overflowY: 'scroll', overflowX: 'hidden' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
      <Box sx={{ display: 'flex', p: 1, flexDirection: 'row', height: '70%', width: '100%' }}>          
          {
              listCard
          }
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

export default HomeScreen;