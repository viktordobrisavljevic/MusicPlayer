package com.mp.MPlayer.Repository;

import com.mp.MPlayer.Model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    Page<Song> findAll(Pageable pageable);

    Song findByName(String name);

    @Query(value = "SELECT * FROM song WHERE LOWER(name) LIKE LOWER(CONCAT('%', :searchInput, '%'))", nativeQuery = true)
    List<Song> findSongsByNameContaining(@Param("searchInput") String searchInput);

    @Modifying
    @Query(value = "DELETE FROM library_song WHERE library_id = :libraryId AND song_id = :songId", nativeQuery = true)
    void removeSongFromLibrary(@Param("libraryId") Long libraryId, @Param("songId") Long songId);

}
