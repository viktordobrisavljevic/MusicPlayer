package com.mp.MPlayer.Model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "song")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long Id;

    @Column(name = "name")
    private String name;

    @Column(name = "album")
    private String album;

    @Column(name = "artist")
    private String artist;

    public Long getId(){
        return this.Id;
    }

    public void setId(Long Id){
        this.Id= Id;
    }

    public String getName(){
        return this.name;
    }

    public void setName(String name){
        this.name=name;
    }

    public String getAlbum(){
        return this.album;
    }

    public void setAlbum(String album){
        this.album=album;
    }

    public String getArtist(){
        return this.artist;
    }

    public void setArtist(String artist){
        this.artist=artist;
    }


}
