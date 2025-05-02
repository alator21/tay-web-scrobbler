# Tay web scrobbler

### Warning: WIP software

<hr>

### Tay Web Scrobbler is a Last.fm scrobbler for yt-music(browser extension)

## Credits

- Logo Icon: https://icons8.com/icon/11953/modern-art


## For the source code reviewers(folks at Mozilla)

### Overview

Tay web scrobbler is a browser extension that helps users automatically "store" the songs they listen through "Youtube Music"
to their last.fm account. It does this by scraping the "Youtube Music" website and determining when a song is listened to.


### Internals

This extension communicates with the last.fm service. It requires an "API KEY" and an "API_SECRET"
of a last.fm application in order to be usable. Aside that, a user, using this extension, should have
their own last.fm account(username and password) in order to be able to connect the songs they listen with it.
The extension uses the "identity" permission to be able to act on user behalf and store the songs they listen.
The extensions scrapes the "Youtube Music" website and tries to figure out when a song is been played and when a songs
is been listened to(functionality to control aspects of this are in the options menu).

### Develop locally

You first need to create a last.fm application(https://www.last.fm/api/account/create).
- For the folks at mozilla a sample application has already been created and the credentials to it will be sent to use
via a secure channel.
Create a `.env`(see `.env.sample` for the format of it) file in the root of the project and add the credentials of the application.
Install the required packages
- `npm install`
Start the application in DEV mode
- `npm run dev:firefox --mv2`

### How to use the extension

- Clicking on the extension pops up a a modal which prompts the user to authenticate.
- Clicking on the authenticate button, will spawn a new window that has the last.fm login site loaded.
- There you must enter your credentials(username,password) and then accept the next prompt about the "App" using your data.
- After you enter your credentials correctly, you can see the main state of the application,
containing your last.fm username alongside the current song that is playing.
- Open the "Youtube Music" application and start listening to a song.
- When you now click on the extension it should indicate that the song is playing.
- At certain times, the app will communicate with the last.fm api to store the songs that you listened to.



