import React, { Component } from 'react';

export default function Home() {
    return (
        <div class='page-container home'>
            <div class='header'>
                <h1>Spotify Steward</h1>
                <a class='account-link' href='/account' title='Manage your user account'>Account</a>
            </div>
            <div class='main-content'>
                <div class='homepage-nav'>
                    <a href='/generate' title='Generate a unique Spotify playlist' >Generate Playlist</a>
                    <a href='/download' title='Download a Spotify playlist or song'>Download Playlist</a>
                </div>
            </div>
        </div>
    );
}