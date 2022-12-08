import { createContext, useContext, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_PUBLISHED_ID_NAME_PAIRS: "LOAD_PUBLISHED_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SELECT_LIST: "SELECT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        publishedIdNamePairs: [],
        currentList: null,
        selectedList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
    });
    const history = useHistory();


    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS: {
                return setStore({
                  currentModal : CurrentModal.NONE,
                  idNamePairs: store.idNamePairs,
                  publishedIdNamePairs: payload,
                  currentList: null,
                  currentSongIndex: -1,
                  currentSong: null,
                  newListCounter: store.newListCounter,
                  listNameActive: false,
                  listIdMarkedForDeletion: null,
                  listMarkedForDeletion: null
                })
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }

            case GlobalStoreActionType.SELECT_LIST: {
              return setStore({
                currentModal : CurrentModal.NONE,
                idNamePairs: store.idNamePairs,
                publishedIdNamePairs: store.publishedIdNamePairs,
                currentList: payload,
                selectedList: payload,
                currentSongIndex: -1,
                currentSong: null,
                newListCounter: store.newListCounter,
                listNameActive: false,
                listIdMarkedForDeletion: null,
                listMarkedForDeletion: null
              })
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    publishedIdNamePairs: store.publishedIdNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: null
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/")
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createNewPlaylist(newListName, [], auth.user.email);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            store.loadIdNamePairs()
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
              }
            );
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.duplicatePlaylist = async function (playlist) {
        const body = {
            name: playlist.name,
            songs: playlist.songs,
        }
        const response =  await api.createPlaylist(body)
        if (response.status === 201) {
          tps.clearAllTransactions();
          let newList = response.data.playlist;
          storeReducer({
              type: GlobalStoreActionType.CREATE_NEW_LIST,
              payload: newList
            }
          )

          history.push("/playlist/" + newList._id);
        }
        else {
          console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }
    store.searchByNamePrivate = function (search) {
        async function asyncSearch(search) {
            const response = await api.searchByNamePrivate(search)
            if (response.data.success) {
              let pairsArray = response.data.idNamePairs
              storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
              })
            }
        } 
        asyncSearch(search)
    }

    store.loadPublishedIdNamePairs = function () {
        async function asyncLoadPublishedIdNamePairs() {
            const response = await api.getPublishedPlaylists()
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                    payload: pairsArray
                })
            }
            else {
              console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadPublishedIdNamePairs()
    }

    store.searchByName = function (search) {
        async function asyncSearch(search) {
            if (search) {
              console.log(search)
              const response = await api.searchByName(search)
              console.log(response.data.idNamePairs)
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs
                storeReducer({
                  type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                      payload: pairsArray
                })
              }
            }
            else {
                storeReducer({
                  type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                  payload: []
                })
            }
        } 
        asyncSearch(search)
    }
    store.searchByUser = function (search) {
        async function asyncSearch(search) {
            console.log(search)
            const response = await api.searchByUser(search)
            if (response.data.success) {
              let pairsArray = response.data.idNamePairs
              storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                    payload: pairsArray
              })
            }
        } 
        asyncSearch(search)
    }

    store.sortBy = function(key) {
        switch (key) {
          // Name (A-Z)
          case 1:
            const sortByName = store.publishedIdNamePairs
            sortByName.sort((a, b) => (a.name).localeCompare(b.name))
            storeReducer({
              type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
              payload: sortByName
            })
            break
          // Publish Date (Newest)
          case 2:
            const sortByPublish = store.publishedIdNamePairs
            sortByPublish.sort((a, b) => (new Date(b.updatedAt) - new Date(a.updatedAt)))
            storeReducer({
              type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
              payload: sortByPublish
            })
            break
          // Listens (High - Low)
          case 3:
              const sortByListens = store.publishedIdNamePairs
              sortByListens.sort((a, b) => (a.listens).localeCompare(b.listens))
              storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                payload: sortByListens
              })
              break
          // Likes (High - Low)
          case 4:
              const sortByLikes = store.publishedIdNamePairs
              sortByLikes.sort((a, b) => (b.likes.length) - (a.likes.length))
              storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
                payload: sortByLikes
              })
              break
          // Dislikes (High - Low)
          case 5:
            const sortByDislikes = store.publishedIdNamePairs
            sortByDislikes.sort((a, b) => (b.dislikes.length) - (a.dislikes.length))
            storeReducer({
              type: GlobalStoreActionType.LOAD_PUBLISHED_ID_NAME_PAIRS,
              payload: sortByDislikes
            })
            break
          // Creation (Old - New)
          case 6:
            const sortByCreation = store.idNamePairs
            sortByCreation.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)))
            storeReducer({
              type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
              payload: sortByCreation
            })
            break
          // Last Edited (New - Old)
          case 7:
            const sortByUpdate = store.idNamePairs
            sortByUpdate.sort((a, b) => (new Date(b.updatedAt) - new Date(a.updatedAt)))
            storeReducer({
              type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
              payload: sortByUpdate
            })
            break
          case 8:
            const sortByName2 = store.idNamePairs
            sortByName2.sort((a, b) => (a.name).localeCompare(b.name))
            storeReducer({
              type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
              payload: sortByName2
            })
            break
          default:
            break
        }
    }

    store.updateLikes = function(playlist) {
        async function asyncUpdateLikes(playlist) {
            const response = await api.updateLikes(playlist)
            if (response.data.success) {
                store.loadPublishedIdNamePairs()
            }
        }
        asyncUpdateLikes(playlist)
    }

    store.updateDislikes = function(playlist) {
      async function asyncUpdateDislikes(playlist) {
          const response = await api.updateDislikes(playlist)
          if (response.data.success) {
              store.loadPublishedIdNamePairs()
          }
      }
      asyncUpdateDislikes(playlist)
  }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                console.log(id)
                store.loadIdNamePairs();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.selectList = function(id) {
        async function asyncSelectList(id) {
          if (!id) {
            storeReducer({
                type: GlobalStoreActionType.SELECT_LIST,
                payload: null
            })
          } else {
            let response = await api.getPlaylistById(id)
            if (response.data.success) {
                let playlist = response.data.playlist
                storeReducer({
                    type: GlobalStoreActionType.SELECT_LIST,
                    payload: playlist
                });
            }
          }
        }
        asyncSelectList(id)
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        console.log("list: " + store.currentList)
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                store.idNamePairs.forEach(checkList)
                function checkList(list, index) {
                    if (list._id === store.currentList._id) {
                        store.idNamePairs.splice(index, 1, store.currentList)
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.addComment = function(text) {
        async function asyncAddComment() {
            const comment = {
                username: auth.user.username,
                comment: text
            }
            const response = await api.addComment(store.selectedList._id, comment)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SELECT_LIST,
                    payload: response.data.playlist
                })
            }
        }
        asyncAddComment()
    }

    store.publishList = function(playlist) {
        async function asyncPublish(playlist) {
          const response = await api.publishList(playlist)
          if (response.data.success) {
              store.loadIdNamePairs()
              storeReducer({
                  type: GlobalStoreActionType.SELECT_LIST,
                  payload: response.data.playlist
              })
          }
        }
        asyncPublish(playlist)
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return true;
    }
    store.canUndo = function() {
        return (((store.currentList !== null) && tps.hasTransactionToUndo()) && (store.currentSong === null));
    }
    store.canRedo = function() {
        return (((store.currentList !== null) && tps.hasTransactionToRedo()) && (store.currentSong === null));
    }
    store.canClose = function() {
      return ((store.currentList !== null) && (store.currentSong === null));
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };