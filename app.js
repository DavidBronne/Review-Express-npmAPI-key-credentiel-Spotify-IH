require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
    // To avoid making our API keys public. ".env" will be ignored when app uploaded on Github
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req,res,next) => {
    console.log('in get index')
    res.render('index')
});

app.get('/artist-search', (req,res,next) => {
    const { name } = req.query;

    spotifyApi.searchArtists(name)
        .then(data => {
            // console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
            console.log('The received data from the API: ', data.body.artists);
            res.render('artist-search-results',data.body.artists);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            console.log('Artist Albums', data.body.items[0]);
            res.render('albums', data.body)
        })
        .catch(err => console.log('Error during Artist Albums req', err))
})

app.get('/tracks/:albumId', (req,res,next) => {
    const { albumId } = req.params;

    spotifyApi.getAlbumTracks(albumId)
        .then( data => {
            console.log('Album tracks', data.body);
            res.render('tracks',data.body);
        })
        .catch(err => console.log('Error during track request', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
