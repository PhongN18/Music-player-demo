const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PN_PLAYER'

const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playBtn = $('.btn-toggle-play')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    
    // Render playlist
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
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
        playlist.innerHTML = htmls.join('')

    },

    // Định nghĩa thuộc tính
    defineProperties: function () {
        // Add or change the properties in object 
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lý sự kiện
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
            _this.render()
            _this.scrollToActiveSong()
        }

        // When press prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Random btn
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            // toggle 2nd param -> bool, if true => add, else remove
        }

        // Repeat btn
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // When audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                // same as clicked manually
                nextBtn.click()
            }
        }

        // Xử lý khi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active')
            // closest() -> search the DOM for elements which match the given CSS selector

            // find the closest element with class 'song' and without class 'active'
            if (songNode || e.target.closest('.option')) 
            {
                // Xử lý khi click vào song 
                if (songNode) {
                    // dataset used fot 'data-' attribute
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // Khi play đến bài nào thì scroll đến bài đó
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',

            })
        }, 200)
    },

    // Chuyển bài tiếp theo
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Chuyển bài trước đó
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Phát random
    playRandom: function() {
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === randomIndex)

        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },

    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Listen / handle events (DOM events)
        this.handleEvents()

        // Define / change object properties
        this.defineProperties()

        // Load first song to UI
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat & random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)

    }
}

app.start()