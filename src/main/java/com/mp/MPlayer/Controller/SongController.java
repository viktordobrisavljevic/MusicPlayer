package com.mp.MPlayer.Controller;

import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
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
    public List<Song> getAllSongs(){
        return songService.getAllSongs();
    }

    @GetMapping("/api/song/{songName}")
    public Song getSong(@PathVariable String songName){
        return songService.getSong(songName);
    }
}
