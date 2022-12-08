/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.get('/published', PlaylistController.getPublishedPlaylists)
router.put('/playlist/:id/comment', auth.verify, PlaylistController.addComment)
router.get('/myplaylistbyname/:search', auth.verify, PlaylistController.getMyPlaylistsByName)
router.get('/playlistbyname/:search', PlaylistController.getPlaylistsByName)
router.get('/playlistbyuser/:search', PlaylistController.getPlaylistsByUser)
router.put('/playlist/:id/like', auth.verify, PlaylistController.updateLikes)
router.put('/playlist/:id/dislike', auth.verify, PlaylistController.updateDislikes)
router.put('/playlist/:id/publish', auth.verify, PlaylistController.publishListById)

module.exports = router