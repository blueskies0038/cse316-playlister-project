const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        playlist.ownerName = user.username
        playlist.owner = user._id
        playlist.ownerEmail = user.email
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: error
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({ success: true });
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));
        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            songs: list.songs,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            listens: list.listens,
                            ownerName: list.ownerName,
                            comments: list.comments,
                            isPublished: list.isPublished,
                            createdAt: list.createdAt,
                            updatedAt: list.updatedAt
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}

getPublishedPlaylists = async (req, res) => {
  async function asyncFindList() {
      await Playlist.find({ isPublished: true }, (err, playlists) => {
          console.log("found Playlists: " + JSON.stringify(playlists));
          if (err) {
              return res.status(400).json({ success: false, error: err })
          }
          if (!playlists) {
              return res
                  .status(404)
                  .json({ success: false, error: 'Playlists not found' })
          }
          else {
              console.log("Send the Playlist pairs");
              let pairs = [];
              for (let key in playlists) {
                  let list = playlists[key];
                  console.log('FESGTKHRYJHTFEWQDFGHYTR%$U^IYTHGTEWRF')
                  console.log(list.createdAt)
                  let pair = {
                      _id: list._id,
                      name: list.name,
                      songs: list.songs,
                      likes: list.likes,
                      dislikes: list.dislikes,
                      listens: list.listens,
                      ownerName: list.ownerName,
                      comments: list.comments,
                      createdAt: list.createdAt,
                      updatedAt: list.updatedAt
                  };
                  pairs.push(pair);
              }
              console.log(pairs)
              return res.status(200).json({ success: true, idNamePairs: pairs })
          }
      }).catch(err => console.log(err))
  }
  asyncFindList()
}

addComment = async (req, res) => {
  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
        return res.status(404).json({
            err,
            message: 'Playlist not found!',
        })
    }

    const comments = playlist.comments
    comments.push(req.body)
    console.log(req.body)
    playlist.comments = comments
    playlist
        .save()
        .then(() => {
            console.log("SUCCESS!!!");
            console.log(playlist.comments)
            return res.status(200).json({
                success: true,
                playlist: playlist,
                message: 'Comment added!',
            })
        })
        .catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Comment not added!',
            })
        })
  })
}

getPlaylistsByName = async (req, res) => {
    console.log("search: " + req.params.search)
    if (!req.params.search) {
       return res.status(200).json({ success: true, idNamePairs: [] })
    }
    const nameRegEx = new RegExp(req.params.search, "i")
    Playlist.find({ name: nameRegEx, isPublished: true }, (err, playlists) => {
      if (err) {
          return res.status(400).json({ success: false, error: err })
      }
      if (!playlists) {
          return res
              .status(404)
              .json({ success: false, error: 'Playlists not found' })
      }
      else {
          console.log("Send the Searched Playlist pairs");
          let pairs = [];
          for (let key in playlists) {
              let list = playlists[key];
              let pair = {
                  _id: list._id,
                  name: list.name,
                  songs: list.songs,
                  likes: list.likes,
                  dislikes: list.dislikes,
                  listens: list.listens,
                  ownerName: list.ownerName,
                  comments: list.comments
              };
              pairs.push(pair);
          }
          return res.status(200).json({ success: true, idNamePairs: pairs })
      }
    })
}

getMyPlaylistsByName = async (req, res) => {
  if (req.params.search === '') {
    return res.status(200).json({ success: true, idNamePairs: [] })
  }
  const nameRegEx = new RegExp(req.params.search, "i")

  Playlist.find({ name: nameRegEx, ownerId: req.userId }, (err, playlists) => {
    console.log(playlists)
    if (err) {
        return res.status(400).json({ success: false, error: err })
    }
    if (!playlists) {
        return res
            .status(404)
            .json({ success: false, error: 'Playlists not found' })
    }
    else {
        console.log("Send the Playlist pairs");
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                songs: list.songs,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens,
                ownerName: list.ownerName,
                comments: list.comments
            };
            pairs.push(pair);
        }
        console.log(pairs)
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }
  })
}

getPlaylistsByUser = async (req, res) => {
    if (req.params.search === '') {
      return res.status(200).json({ success: true, idNamePairs: [] })
    }
    const nameRegEx = new RegExp(req.params.search, "i")

    Playlist.find({ ownerName: nameRegEx, isPublished: true }, (err, playlists) => {
      console.log(playlists)
    if (err) {
        return res.status(400).json({ success: false, error: err })
    }
    if (!playlists) {
        return res
            .status(404)
            .json({ success: false, error: 'Playlists not found' })
    }
    else {
        console.log("Send the Playlist pairs");
        let pairs = [];
        for (let key in playlists) {
            let list = playlists[key];
            let pair = {
                _id: list._id,
                name: list.name,
                songs: list.songs,
                likes: list.likes,
                dislikes: list.dislikes,
                listens: list.listens,
                ownerName: list.ownerName,
                comments: list.comments
            };
            pairs.push(pair);
        }
        console.log(pairs)
        return res.status(200).json({ success: true, idNamePairs: pairs })
      }
    })
}

updateLikes = async (req, res) => {
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
      if (err) {
        return res.status(400).json({ success: false, error: err })
      }
      if (!playlist) {
          return res
              .status(404)
              .json({ success: false, error: 'Playlist not found' })
      }

      const likes = playlist.likes
      if (likes.includes(req.userId)) {
          const index = likes.indexOf(req.userId)
          likes.splice(index, 1)
      } else {
          likes.push(req.userId)
          playlist.likes = likes
      }

      const dislikes = playlist.dislikes
      if (dislikes.includes(req.userId)) {
        const index = dislikes.indexOf(req.userId)
        dislikes.splice(index, 1)
      }

      playlist
        .save()
        .then(() => {
            console.log("SUCCESS!!!");
            console.log(playlist.likes)
            return res.status(200).json({
                success: true,
                playlist: playlist,
                message: 'Like added!',
            })
        })
        .catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Like not added!',
            })
        })
    })
}

updateDislikes = async (req, res) => {
  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    if (err) {
      return res.status(400).json({ success: false, error: err })
    }
    if (!playlist) {
        return res
            .status(404)
            .json({ success: false, error: 'Playlist not found' })
    }

    const dislikes = playlist.dislikes
    if (dislikes.includes(req.userId)) {
        const index = dislikes.indexOf(req.userId)
        dislikes.splice(index, 1)
    } else {
        dislikes.push(req.userId)
        playlist.dislikes = dislikes
    }

    const likes = playlist.likes
    if (likes.includes(req.userId)) {
      const index = likes.indexOf(req.userId)
      likes.splice(index, 1)
    }

    playlist
      .save()
      .then(() => {
          console.log("SUCCESS!!!");
          console.log(playlist.dislikes)
          return res.status(200).json({
              success: true,
              playlist: playlist,
              message: 'Dislike added!',
          })
      })
      .catch(error => {
          console.log("FAILURE: " + JSON.stringify(error));
          return res.status(404).json({
              error,
              message: 'Dislike not added!',
          })
      })
  })
}

publishListById = async (req, res) => {
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
      if (err) {
        return res.status(404).json({
            err,
            message: 'Playlist not found!',
        })
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
        await User.findOne({ email: list.ownerEmail }, (err, user) => {
            console.log("user._id: " + user._id);
            console.log("req.userId: " + req.userId);
            if (user._id == req.userId) {
                console.log("correct user!");

                list.isPublished = true
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            playlist: list,
                            message: 'Playlist updated!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Playlist not updated!',
                        })
                    })
            }
            else {
                console.log("incorrect user!");
                return res.status(400).json({ success: false, description: "authentication error" });
            }
          });
        }
      asyncFindUser(playlist);
    })
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    getPublishedPlaylists,
    addComment,
    getMyPlaylistsByName,
    getPlaylistsByName,
    getPlaylistsByUser,
    updateLikes,
    updateDislikes,
    publishListById
}