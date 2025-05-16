package com.mp.MPlayer.Controller;

import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class SongController {

    private final SongService songService;

    @Autowired
    public SongController(SongService songService){
        this.songService = songService;
    }

    @GetMapping("/api/songs")
    public Page<Song> getSongsPage(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        return songService.getSongsPage(page, size);
    }

    @GetMapping("/songs/search")
    public List<Song> searchSongs(@RequestParam String searchSong) {
        return songService.searchSongs(searchSong);
    }

    @GetMapping("/api/song/{songName}")
    public Song getSong(@PathVariable String songName){
        return songService.getSong(songName);
    }

    @DeleteMapping("/api/{libraryId}/{songId}")
    public void deleteSong(@PathVariable Long libraryId, @PathVariable Long songId) {
        songService.deleteSong(libraryId, songId);
    }
    
}
