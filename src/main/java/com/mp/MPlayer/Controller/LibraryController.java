package com.mp.MPlayer.Controller;


import com.mp.MPlayer.Model.CustomUser;
import com.mp.MPlayer.Model.Library;
import com.mp.MPlayer.Model.Song;
import com.mp.MPlayer.Service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/libraries")
public class LibraryController {

    private final LibraryService libraryService;

    @Autowired
    public LibraryController(LibraryService libraryService){
        this.libraryService = libraryService;
    }

    @GetMapping
    public List<Library> getLibraries(){
        return libraryService.getLibraries();
    }

    @PostMapping
    public void createLibrary(@RequestBody Library library) {
        libraryService.createLibrary(library);
    }

    @PostMapping("/{libraryId}/songs/{songId}")
    public void addSong(@PathVariable Long libraryId, @RequestBody Long songId) {
        libraryService.addSong(libraryId, songId);
    }

    @GetMapping("/{libraryId}/songs")
    public Set<Song> getSongsInLibrary(@PathVariable Long libraryId) {
        return libraryService.getSongsInLibrary(libraryId);
    }

    @DeleteMapping("/{libraryId}")
    public void deleteLibrary(@PathVariable Long libraryId) {
        libraryService.deleteLibrary(libraryId);
    }
}
