import { Box } from '@mui/material';
import React, { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import GlobalStoreContext from '../store';

import IconButton from '@mui/material/IconButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';

export default function YouTubePlayerExample() {
    const { store } = useContext(GlobalStoreContext);
    const [currentSong, setCurrentSong] = useState(0);

    let playlist = [];
    let player;
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    if(store.selectedList && store.selectedList.songs){
        for(var i = 0; i < store.selectedList.songs.length; i++){
            playlist.push(store.selectedList.songs[i]);
        }
    } 

    const playerOptions = {
        height: '270',
        width: '480',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(p) {
      if (playlist[currentSong] != null){
        let song = playlist[currentSong].youTubeId;
        
        player = p;
        player.cueVideoById(song);
      }
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        setCurrentSong(currentSong + 1);
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        player = event.target;
        player.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    let title = "";
    let artist = "";

    if(playlist && playlist[currentSong]){
        title = playlist[currentSong].title;
        artist = playlist[currentSong].artist;
    }


    function handlePlay(){
        player.playVideo();
    }

    function handlePause(){
        player.pauseVideo();
    }

    function handleRewind(){
        if(currentSong > 0){
            setCurrentSong(currentSong - 1);
            loadAndPlayCurrentSong(player);
        }
    }

    function handleSkip(){
        if(currentSong < playlist.length - 1){
            setCurrentSong(currentSong + 1);
            loadAndPlayCurrentSong(player);
        }
    }

    if (playlist != null && playlist.length > 0) {
        return (
          <Box>
            <YouTube
              videoId={playlist[currentSong]}
              opts={playerOptions}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange} />
              <Box>
              <p className='player-span' style={{ width: '100%', textAlign: 'center', fontWeight: '700' }}> Now Playing</p>
                <p className='player-span'> Playlist: {store.selectedList.name} </p>
                <p className='player-span'> Song #: {currentSong + 1}</p>
                <p className='player-span'> Title: {title}</p>
                <p className='player-span'> Artist: {artist} </p>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton onClick={handleRewind}><FastRewindRoundedIcon sx = {{color: "black", fontSize: 24}}></FastRewindRoundedIcon></IconButton>
                  <IconButton onClick={handlePause}><PauseRoundedIcon sx = {{color: "black", fontSize: 24}}></PauseRoundedIcon></IconButton>
                  <IconButton onClick={handlePlay}><PlayArrowRoundedIcon sx = {{color: "black", fontSize: 24}}></PlayArrowRoundedIcon></IconButton>
                  <IconButton onClick={handleSkip}><FastForwardRoundedIcon sx = {{color: "black", fontSize: 24}}></FastForwardRoundedIcon></IconButton>
              </Box>
          </Box>
        )
    } else {
      return (
        <Box sx={{ width: '480px', height: '270px' }}>
            <Box sx={{ width: '100%', height: '100%', backgroundColor: 'gray' }}>
            </Box>
            <Box>
              <p className='player-span' style={{ width: '100%', textAlign: 'center', fontWeight: '700' }}> Now Playing</p>
              <p className='player-span'> Playlist: </p>
              <p className='player-span'> Song #:</p>
              <p className='player-span'> Title:</p>
              <p className='player-span'> Artist:</p>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton><FastRewindRoundedIcon sx = {{color: "black", fontSize: 24}}></FastRewindRoundedIcon></IconButton>
                <IconButton><PauseRoundedIcon sx = {{color: "black", fontSize: 24}}></PauseRoundedIcon></IconButton>
                <IconButton><PlayArrowRoundedIcon sx = {{color: "black", fontSize: 24}}></PlayArrowRoundedIcon></IconButton>
                <IconButton><FastForwardRoundedIcon sx = {{color: "black", fontSize: 24}}></FastForwardRoundedIcon></IconButton>
            </Box>
        </Box>
      )
    }
}