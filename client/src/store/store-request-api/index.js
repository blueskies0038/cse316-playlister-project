import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const createNewPlaylist = (newListName, newSongs, userEmail) => {
    return api.post(`/playlist/`, {
        name: newListName,
        songs: newSongs,
        ownerEmail: userEmail,
        isPublished: false
    })
}
export const createPlaylist = (body) => {
    return api.post('/playlist', body)
}
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistPairs = () => api.get(`/playlistpairs/`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        playlist : playlist
    })
}
export const getPlaylists = () => api.get('/playlists')
export const getPublishedPlaylists = () => api.get('/published')
export const addComment = (id, body) => {
    return api.put(`/playlist/${id}/comment`, body)
}
export const searchByNamePrivate = (param) => {
  return api.get(`/myplaylistbyname/${param}`)
}
export const searchByName = (param) => {
  return api.get(`/playlistbyname/${param}`)
}
export const searchByUser = (param) => {
  return api.get(`/playlistbyuser/${param}`)
}
export const updateLikes = (id) => {
  return api.put(`/playlist/${id}/like`)
}

export const updateDislikes = (id) => {
  return api.put(`/playlist/${id}/dislike`)
}

export const publishList = (id) => {
    return api.put(`/playlist/${id}/publish`)
}

const apis = {
    createNewPlaylist,
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    getPlaylists,
    getPublishedPlaylists,
    addComment,
    searchByName,
    searchByUser,
    updateLikes,
    updateDislikes,
    publishList
}

export default apis