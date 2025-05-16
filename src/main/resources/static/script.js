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
                            <p style="cursor: pointer; display: inline;"; class="song-button" onclick="redirectToIndex('${song.name}', '${song.artist}', '${song.album}')">
                                ${song.name}
                            </p>
                            <a href="#" style="cursor: pointer;" onclick="removeSong(${libraryId},${song.id})">x</a>
                        </li>`;
                });
            }
        })
        .catch(error => console.error('Error fetching songs in library:', error));
}

function redirectToIndex(songName, artist, album) {
    window.location.href = `index.html?song=${songName}&artist=${artist}&album=${album}`;
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

function searchSongs(event) {
    event.preventDefault();

    const searchInput = document.querySelector('input[name="search"]').value;

    if (searchInput.trim() === "") {
        alert("Please enter a song name");
        return;
    }

    const url = `/songs/search?searchSong=${searchInput}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Returned data:", data);
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
        .catch(error => {
            console.error('Error fetching songs:', error);
            alert('Error while searching');
        });
}


let currentPage = 0;
const pageSize = 10;

function loadSongs(page) {
    fetch(`/api/songs?page=${page}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            displaySongs(data.content);
            displayPagination(data);
        })
        .catch(error => console.error('Error loading songs:', error));
}

function displaySongs(songs) {
    const tableBody = document.getElementById('songs-table-body');
    tableBody.innerHTML = '';

    fetch('/libraries')
        .then(response => response.json())
        .then(libraries => {
            songs.forEach((song, index) => {
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = index + 1;
                row.insertCell(1).innerText = song.name;
                row.insertCell(2).innerText = song.album;
                row.insertCell(3).innerText = song.artist;

                const dropdownCell = row.insertCell(4);
                let dropdownHTML = `
                    <div class="dropdown">
                        <button class="dropbtn">Add</button>
                        <div class="dropdown-content">
                `;

                libraries.forEach(library => {
                    dropdownHTML += `
                        <a href="#" onclick="addSong(${song.id}, ${library.id})">${library.name}</a>
                    `;
                });

                dropdownHTML += `</div></div>`;

                dropdownCell.innerHTML = dropdownHTML;
            });
        })
        .catch(error => {
            console.error('Error fetching libraries:', error);
            alert('Error fetching libraries for dropdown');
        });
}

function displayPagination(data) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const totalPages = data.totalPages;
    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i + 1;
        pageButton.onclick = () => loadSongs(i);
        paginationDiv.appendChild(pageButton);
    }
}

document.querySelector('form').addEventListener('submit', searchSongs);

document.addEventListener('DOMContentLoaded', function() {
    loadSongs(currentPage);
});