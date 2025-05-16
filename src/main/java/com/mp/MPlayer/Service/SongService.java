package com.mp.MPlayer.Service;

import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SongService {

    private final SongRepository songRepository;

    @Autowired
    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public Page<Song> getSongsPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return songRepository.findAll(pageable);
    }

    public List<Song> searchSongs(String searchInput){
        return songRepository.findSongsByNameContaining(searchInput);
    }

    public Song getSong(String songName){
        return songRepository.findByName(songName);
    }

    @Transactional
    public void deleteSong(Long libraryId, Long songId){
        songRepository.removeSongFromLibrary(libraryId, songId);
    }
}
