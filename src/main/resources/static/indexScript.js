function expandLibrary() {
    const l = document.getElementsByClassName("lib")[0];

    if (l.style.gridRow === "1 / 17") {
        l.style.gridRow = "1 / 2";
        l.innerHTML = '<span onclick="expandLibrary()">&#9776; Library</span>';
    } else {
        l.style.gridRow = "1 / 17";

        fetch('/libraries')
            .then(response => response.json())
            .then(data => {
                let playlistsHTML = '<div style="border-top:solid;padding-left: 20px;">';
                playlistsHTML += '<button id="new-playlist-btn" style="width:150px;height:70px;margin-top:10px;background-color: rgb(113, 131, 124);">New Playlist</button>';
                playlistsHTML += '<h3>Playlists:</h3>';

                data.forEach(library => {
                    playlistsHTML += `<p style="cursor:pointer; display:inline;" onclick="showSongsInLibrary(${library.id})">${library.name}</p>
                    <a href="#" style="cursor: pointer;" onclick="removeLibrary(${library.id})">x</a><br>`;
                });

                playlistsHTML += '</div>';
                l.innerHTML = `
                    <div>
                        <span style="padding: 13px 180px 13px 20px; cursor: pointer;" onclick="expandLibrary()">&#9776; Library</span>
                        ${playlistsHTML}
                    </div>
                `;

                const newPlaylistBtn = document.getElementById('new-playlist-btn');
                if (newPlaylistBtn) {
                    newPlaylistBtn.addEventListener('click', openModal);
                }
            })
            .catch(error => console.error('Error fetching libraries:', error));
    }
}

function openModal() {
    const modal = document.getElementById("playlist-modal");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error('Modal element not found!');
    }
}

function closeModal() {
    document.getElementById("playlist-modal").style.display = "none";
}

function createPlaylist() {
    const name = document.getElementById("playlist-name").value;

    fetch("/libraries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => {
        if (response.ok) {
            alert("Playlist created successfully!");
            updateLibraryList();
            closeModal();
        } else {
            alert("Failed to create playlist.");
        }
    })
    .catch(error => console.error('Error creating playlist:', error));
}

function updateLibraryList() {
    fetch('/libraries')
        .then(response => response.json())
        .then(data => {
            const l = document.getElementsByClassName("lib")[0];
            let playlistsHTML = '<div style="border-top:solid;padding-left: 20px;">';
            playlistsHTML += '<button id="new-playlist-btn" style="width:150px;height:70px;margin-top:10px;background-color: rgb(113, 131, 124);">New Playlist</button>';
            playlistsHTML += '<h3>Playlists:</h3>';

            data.forEach(library => {
                playlistsHTML += `<p style="cursor: pointer; display:inline;" onclick="showSongsInLibrary(${library.id})">${library.name}</p>
                <a href="#" style="cursor: pointer;" onclick="removeLibrary(${library.id})">x</a><br>`;
            });

            playlistsHTML += '</div>';
            l.innerHTML = `
                <div>
                    <span style="padding-left: 20px;" onclick="expandLibrary()">&#9776; Library</span>
                    ${playlistsHTML}
                </div>
            `;

            const newPlaylistBtn = document.getElementById('new-playlist-btn');
            if (newPlaylistBtn) {
                newPlaylistBtn.addEventListener('click', openModal);
            }
        })
        .catch(error => console.error('Error fetching libraries:', error));
}

function showSongsInLibrary(libraryId) {
    fetch(`/libraries/${libraryId}/songs`)
        .then(response => response.json())
        .then(songs => {
            let playlistContainer = document.querySelector('.playlist ol');
            playlistContainer.innerHTML = '';

            if (songs.length === 0) {
                playlistContainer.innerHTML = '<li>No songs in this playlist.</li>';
            } else {
                songs.forEach(song => {
                    playlistContainer.innerHTML += `
                    <li>
                        <p style="cursor: pointer; display: inline;" class="song-button" data-name="${song.name}" data-id="${song.id}">${song.name}</p>
                        <a href="#" style="cursor: pointer;" onclick="removeSong(${libraryId},${song.id})">x</a>
                    </li>`;
                });

                const songButtons = playlistContainer.querySelectorAll('.song-button');
                songButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const songName = button.getAttribute('data-name');
                        const songId = button.getAttribute('data-id');
                        const songSrc = `/songs/${songName}.mp3`;

                        const audioPlayer = document.getElementById('audioPlayer');
                        const source = audioPlayer.querySelector('source');
                        source.src = songSrc;
                        audioPlayer.pause();
                        audioPlayer.load();
                        audioPlayer.play();


                        fetch(`/api/song/${songName}`)
                            .then(response => response.json())
                            .then(songData => {
                                const artistElement = document.querySelector('.artist p:first-child');
                                const albumElement = document.querySelector('.artist p:last-child');

                                artistElement.textContent = `Artist: ${songData.artist}`;
                                albumElement.textContent = `Album: ${songData.album}`;
                            })
                            .catch(error => console.error('Error fetching song details:', error));
                    });
                });
            }
        })
        .catch(error => console.error('Error fetching songs in library:', error));
}

function loadSongFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const songName = urlParams.get('song');
    const artistName = urlParams.get('artist');
    const albumName = urlParams.get('album');

    if (songName) {
        const audioFilePath = `/songs/${songName}.mp3`;

        const audioPlayer = document.getElementById('audioPlayer');
        const source = audioPlayer.querySelector('source');
        source.src = audioFilePath;

        audioPlayer.load();
        audioPlayer.play();

        const artistElement = document.getElementById('artist-name');
        const albumElement = document.getElementById('album-name');

        if (artistName) {
            artistElement.textContent = artistName;
        }

        if (albumName) {
            albumElement.textContent = albumName;
        }
    }
}

function removeLibrary(libraryId){
    fetch(`/libraries/${libraryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Successfully deleted!");
        } else {
            console.log("Error deleting!");
        }
    })
}

function removeSong(libraryId, songId){
    fetch(`/api/${libraryId}/${songId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Song successfully removed from library!');
        } else {
            alert('Failed to remove song from library');
        }
    })
}

function generateBars() {
    const soundWaveContainer = document.querySelector('.sound-wave');
    const numberOfBars = 60;
    for (let i = 0; i < numberOfBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        soundWaveContainer.appendChild(bar);
    }
}

window.addEventListener("load", () => {
    const bars = document.querySelectorAll(".bar");

    bars.forEach((item) => {
        const randomDuration = (Math.random() * (0.7 - 0.2) + 0.2).toFixed(2);
        item.style.animationDuration = `${randomDuration}s`;
    });

    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('play', function() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    });

    audioPlayer.addEventListener('pause', function() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadSongFromURL();
    expandLibrary();
    generateBars();
});

