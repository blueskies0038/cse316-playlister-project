import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const [screen, setScreen] = useState("HOME")

    function handleCreateNewList() {
      store.createNewList();
    }

    let text ="";
    if (store.currentList)
        text = store.currentList.name;
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

    return (
        <div id="playlister-statusbar">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;