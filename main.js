const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')

const playBtn = $('.btn-toggle-play')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    // Songs list
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/audio/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Whisper (Hoaprox Official Remix)',
            singer: 'Boombox Cartel ft Nevve',
            path: './assets/audio/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'I CAN\'T FIND YOU',
            singer: 'Hoaprox',
            path: './assets/audio/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Safe And Sound',
            singer: 'Different Heaven',
            path: './assets/audio/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Time',
            singer: 'MKJ',
            path: './assets/audio/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Light it up',
            singer: 'Robin Hustin x TobiMorrow ft Jex',
            path: './assets/audio/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Highscore',
            singer: 'Teminite & Panda Eyes',
            path: './assets/audio/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Fade Away (DEAF KEV Remix)',
            singer: 'Jacob Tillberg',
            path: './assets/audio/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Why Do I',
            singer: 'Unknown Brain ft Bri Tolani',
            path: './assets/audio/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Lullaby',
            singer: 'R3HAB x Mike Williams',
            path: './assets/audio/song10.mp3',
            image: './assets/img/song10.jpg'
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
        // constant representing app
        const _this = this
        const cdWidth = cd.offsetWidth

        // CD thumbnail rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 30000, // 10s
            iterations: Infinity // loop ifinite times
        })

        cdThumbAnimate.pause()

        // CD thumbnail width handle
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY     
            const newCDWidth = cdWidth - scrollTop

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth
        }

        // Press play handle
        playBtn.onclick = function() {
            if (!_this.isPlaying) {
                audio.play()
            } else {
                audio.pause()
            }
        }

        // When song is played
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // When song is paused
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Song progress bar
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent 
            }
        }

        // Seek handle
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime
        }

        // When press next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        // When press prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong()
            }
            audio.play()
        }

        // Random btn
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            // toggle 2nd param -> bool, if true => add, else remove
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandom: function() {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === randomIndex)
        
        this.currentIndex = randomIndex
        this.loadCurrentSong()
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