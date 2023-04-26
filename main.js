const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')

const app = {
    currentIndex: 0,
    // Songs list
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Whisper',
            singer: 'Hoaprox',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'I can\'t find you',
            singer: 'Hoaprox',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Whisper',
            singer: 'Hoaprox',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'I can\'t find you',
            singer: 'Hoaprox',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Whisper',
            singer: 'Hoaprox',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'I can\'t find you',
            singer: 'Hoaprox',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
    ],
    // Render playlist
    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')

    },

    defineProperties: function () {
        // Add or change the properties in object 
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY     
            const newCDWidth = cdWidth - scrollTop

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    start: function () {
        // Listen / handle events (DOM events)
        this.handleEvents()

        // Define / change object properties
        this.defineProperties()

        // Load first song to UI
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()