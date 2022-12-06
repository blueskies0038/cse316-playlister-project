import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List';
import PublishedListCard from './PublishedListCard';

function AllListsScreen() {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadPublishedIdNamePairs();
    }, []);

    return (
      <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
        
      {
          store.publishedIdNamePairs.map((pair) => (
              <PublishedListCard
                  key={pair._id}
                  idNamePair={pair}
              />
          ))
      }
      </List>
    )
}

export default AllListsScreen