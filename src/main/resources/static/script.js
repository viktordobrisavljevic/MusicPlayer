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
                playlistsHTML += '<button id="new-playlist-btn" style="width:150px;height:70px;margin-top:10px;background-color: rgb(113, 131, 124)">New Playlist</button>';
                playlistsHTML += '<h3>Playlists:</h3>';

                data.forEach(library => {
                    playlistsHTML += `<p style="cursor:pointer;" onclick="showSongsInLibrary(${library.id})">${library.name}</p>`;
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
                playlistsHTML += `<p style="cursor: pointer;" onclick="showSongsInLibrary(${library.id})">${library.name}</p>`;
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
                            <p style="cursor: pointer"; class="song-button" onclick="redirectToIndex('${song.name}', '${song.artist}', '${song.album}')">
                                ${song.name}
                            </p>
                        </li>`;
                });
            }
        })
        .catch(error => console.error('Error fetching songs in library:', error));
}

function redirectToIndex(songName, artist, album) {
    window.location.href = `index.html?song=${songName}&artist=${artist}&album=${album}`;
}

function playSong(songName) {
    fetch(`/libraries/${libraryId}/songs`)
        .then(response => response.json())
        .then(songs => {
            let playlistContainer = document.querySelector('.playlist ol');
            playlistContainer.innerHTML = '';

            if (songs.length === 0) {
                playlistContainer.innerHTML = '<li>No songs in this playlist.</li>';
            } else {
                songs.forEach(song => {
                    playlistContainer.innerHTML += `<li>${song.name}</li>`;
                });
            }
        })
        .catch(error => console.error('Error fetching songs in library:', error));
}

function addSong(songId, libraryId) {
    fetch(`/libraries/${libraryId}/songs/${songId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(songId)
    })
    .then(response => {
        if (response.ok) {
            alert('Song successfully added to library!');
        } else {
            alert('Failed to add song to library');
        }
    })
    .catch(error => {
        console.error('Error adding song:', error);
        alert('Error adding song');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/songs')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('songs-table-body');
            tableBody.innerHTML = '';

            fetch('/libraries')
                .then(response => response.json())
                .then(libraries => {
                    data.forEach((song, index) => {
                        let row = tableBody.insertRow();
                        row.insertCell(0).innerText = index + 1;
                        row.insertCell(1).innerText = song.name;
                        row.insertCell(2).innerText = song.album;
                        row.insertCell(3).innerText = song.artist;

                        let dropdownCell = row.insertCell(4);
                        let dropdownHTML = `
                            <div class="dropdown">
                                <button class="dropbtn">Add</button>
                                <div class="dropdown-content">`;

                        libraries.forEach(library => {
                            dropdownHTML += `<a href="#" onclick="addSong(${song.id}, ${library.id})">${library.name}</a>`;
                        });

                        dropdownHTML += `</div></div>`;

                        dropdownCell.innerHTML = dropdownHTML;
                    });
                })
                .catch(error => console.error('Error fetching libraries:', error));
        })
        .catch(error => console.error('Error fetching songs:', error));
});
