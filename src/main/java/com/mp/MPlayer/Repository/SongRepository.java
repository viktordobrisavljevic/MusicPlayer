package com.mp.MPlayer.Repository;

import com.mp.MPlayer.Model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    Song findByName(String name);
}
