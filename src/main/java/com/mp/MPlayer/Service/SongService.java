package com.mp.MPlayer.Service;

import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SongService {

    private final SongRepository songRepository;

    @Autowired
    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<Song> getAllSongs(){
        return songRepository.findAll();
    }

    public Song getSong(String songName){
        return songRepository.findByName(songName);
    }
}
