import { List } from '@mui/material';
import { useContext, useSearchParams } from 'react';
import { GlobalStoreContext } from '../store'
import PublishedListCard from './PublishedListCard';

function UserListsScreen() {
    const { store } = useContext(GlobalStoreContext);

    const [ searchParams, setSearchParams ] = useSearchParams()
    const user = searchParams.get('_user')

    const playlists = store.publishedIdNamePairs.filter(list => list.ownerName.contains(user))

    return (
      <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
        
      {
          playlists.map((pair) => (
              <PublishedListCard
                  key={pair._id}
                  idNamePair={pair}
              />
          ))
      }
      </List>
    )
}

export default UserListsScreen