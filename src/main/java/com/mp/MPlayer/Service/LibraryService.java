package com.mp.MPlayer.Service;


import com.mp.MPlayer.Model.CustomUser;
import com.mp.MPlayer.Model.Library;
import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Repository.LibraryRepository;
import com.mp.MPlayer.Repository.SongRepository;
import com.mp.MPlayer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    @Autowired
    public LibraryService(LibraryRepository libraryRepository, SongRepository songRepository, UserRepository userRepository){
        this.libraryRepository = libraryRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }
    public List<Library> getLibraries(){
        User principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return libraryRepository.findByCustomUserName(principal.getUsername());
    }

    public void createLibrary(Library library){
        User principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<CustomUser> optionalCustomUser = userRepository.findByUsername(principal.getUsername());

        if (optionalCustomUser.isEmpty()) {
            throw new RuntimeException("User not found!");
        }

        CustomUser customUser = optionalCustomUser.get();

        library.setCustomUserName(customUser.getUsername());
        libraryRepository.save(library);
    }

    public void addSong(Long libraryId, Long songId){
        Library library = libraryRepository.findById(libraryId).orElseThrow(() -> new RuntimeException("Library not found!"));
        Song song = songRepository.findById(songId).orElseThrow(() -> new RuntimeException("Song not found!"));

        Set<Song> songs = library.getSongs();
        songs.add(song);
        libraryRepository.save(library);
    }

    public Set<Song> getSongsInLibrary(Long libraryId) {
        Optional<Library> libraryOptional = libraryRepository.findById(libraryId);

        if (libraryOptional.isPresent()) {
            return libraryOptional.get().getSongs();
        } else {
            throw new RuntimeException("Library not found");
        }
    }

}
