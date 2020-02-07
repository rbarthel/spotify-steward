require('dotenv').config();
const request = require('request');

function extractPlaylistData(data) {
    const parsedData = JSON.parse(data)
    const playlistData = [];
    parsedData.playlists.items.forEach((playlist) => {
        playlistData.push({ playlist_id: playlist.id, user_id: playlist.owner.id })
    });
    return playlistData;
}

function extractTrackIDs(data) {
    const parsedData = JSON.parse(data);
    const trackIDs = [];
    parsedData.items.forEach((track) => {
        trackIDs.push(track.track.id);
    });
    return trackIDs;
}

function getUserInfo(token) {
    return new Promise((resolve, reject) => {
        const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        request(options, function(err, response, body) {
            if (response.statusCode === 200) {
                resolve(JSON.parse(response.body).id);
            } else {
                console.log(`error @ getUserInfo. status: ${response.statusCode}. error: ${err}`);
                reject(err);
            }
        });
    });
}

// gets playlists to pick songs from
function getPlaylistsQuery(token, query) {
    return new Promise((resolve, reject) => {
        const options = {
            url: `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=6`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        request(options, function(err, response, body) {
            if (response.statusCode === 200) {
                resolve(extractPlaylistData(body));
            } else {
                console.log(`error @ getPlaylistsQuery. status: ${response.statusCode}. error: ${err}`);
                reject(err);
            }
        });
    });
}

function getTracksInPlaylist(token, user_id, playlist_id) {
    return new Promise((resolve, reject) => {
        const options = {
            url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks?limit=12`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        request(options, function(err, response, body) {
            if (response.statusCode === 200) {
                resolve(extractTrackIDs(body));
            } else {
                console.log(`error @ getTracksInPlaylist. status: ${response.statusCode}. error: ${err}`);
                reject(err);
            }
        });
    });
}

function createPlaylist(token, owner_id, name) {
    return new Promise((resolve, reject) => {
        const options = {
            url: `https://api.spotify.com/v1/users/${owner_id}/playlists`,
            method: 'POST',
            json: true,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                'description': 'created by activity-playlist',
                'public': false,
                'name': name
            }
        };
        request(options, function(err, response, body) {
            if (response.statusCode === 201) {
                resolve(body.id);
            } else {
                console.log(`error @ createPlaylist. status: ${response.statusCode}. error: ${err}`);
                reject(err);
            }
        });
    });
}

// should this be a promise?
function addTracks(token, user_id, playlist_id, tracks) {
    const options = {
        url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
        method: 'POST',
        json: true,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: {
            'uris': tracks
        }
    };
    request(options, function(err, response, body) {
        if (response.statusCode === 201) {
            return body;
        } else {
            console.log(`error @ addTracks. status: ${response.statusCode}. error: ${err}`);
        }
    });
}

module.exports = {
    generatePlaylist: (params) => {
        const token = params.token;
        getPlaylistsQuery(token, params.query).then((playlistData) => {
            let userID;
            const trackIDs = [];
            const promises = playlistData.map((playlist) => {
                return (
                    getTracksInPlaylist(token, playlist.user_id, playlist.playlist_id).then((tracksInPlaylist) => {
                        tracksInPlaylist.forEach((track) => {
                            trackIDs.push(`spotify:track:${track}`);
                        });
                    })  
                )
            });
            const newPlaylist = getUserInfo(token).then((user_id) => {
                userID = user_id;
                createPlaylist(token, user_id, `Playlist for: ${params.query}`).then((data) => {
                    addTracks(token, userID, data, trackIDs);
                    // res.json(`spotify:user:${userID}:playlist:${data}`);
                    resolve(`spotify:user:${userID}:playlist:${data}`);
                });
            }).catch(error => {
                // res.sendStatus(400);
                reject(error);
            });
        }).catch(error => {
            // res.sendStatus(400);
            reject(error);
        });
    }
};