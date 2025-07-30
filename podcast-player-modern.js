document.addEventListener('DOMContentLoaded', function() {
    const playerContainers = document.querySelectorAll('.podcast-player-modern');

    playerContainers.forEach(container => {
        const audioEl = container.querySelector('audio');
        const waveformEl = container.querySelector('.waveform-container');
        const playBtn = container.querySelector('.play-pause-button');
        const currentTimeEl = container.querySelector('.current-time');
        const totalDurationEl = container.querySelector('.total-duration');
        const speedControl = container.querySelector('.speed-control-modern');
        const podcastIcon = container.querySelector('.podcast-icon');
        const progressBarContainer = container.querySelector('.progress-bar-container');
        const progressBar = container.querySelector('.progress-bar');

        if (!audioEl || !waveformEl || !playBtn || !currentTimeEl || !totalDurationEl || !speedControl || !podcastIcon || !progressBarContainer || !progressBar) {
            console.error('One or more podcast player elements are missing.');
            return;
        }

        const wavesurfer = WaveSurfer.create({
            container: waveformEl,
            waveColor: 'rgba(108, 117, 125, 0.2)', // Lighter grey for the background wave
            progressColor: {
                // Gradient for the progress wave, inspired by the image
                '0%': 'rgba(255, 105, 180, 0.8)', // Pinkish
                '50%': 'rgba(0, 191, 255, 0.8)',   // Blueish
                '100%': 'rgba(255, 105, 180, 0.8)' // Pinkish
            },
            cursorColor: 'transparent',
            barWidth: 3,
            barRadius: 5, // More rounded bars
            responsive: true,
            height: 80, // A bit taller to look more impressive
            normalize: true,
            media: audioEl,
            barGap: 2 // Add a small gap between bars
        });

        wavesurfer.on('ready', function () {
            totalDurationEl.textContent = formatTime(wavesurfer.getDuration());
        });

        wavesurfer.on('audioprocess', function () {
            currentTimeEl.textContent = formatTime(wavesurfer.getCurrentTime());
            const progress = wavesurfer.getCurrentTime() / wavesurfer.getDuration();
            progressBar.style.width = `${progress * 100}%`;
        });

        playBtn.addEventListener('click', function () {
            wavesurfer.playPause();
            const isPlaying = wavesurfer.isPlaying();
            playBtn.innerHTML = isPlaying ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
            playBtn.classList.toggle('is-playing', isPlaying);
            podcastIcon.classList.toggle('is-playing', isPlaying);
        });

        progressBarContainer.addEventListener('click', function(e) {
            const bounds = this.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const width = bounds.width;
            const progress = x / width;
            wavesurfer.seekTo(progress);
        });

        let currentSpeed = 1.0;
        const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];

        speedControl.addEventListener('click', () => {
            const currentIndex = speeds.indexOf(currentSpeed);
            const nextIndex = (currentIndex + 1) % speeds.length;
            currentSpeed = speeds[nextIndex];
            
            wavesurfer.setPlaybackRate(currentSpeed);

            speedControl.classList.add('speed-changing');
            setTimeout(() => {
                speedControl.querySelector('.speed-text').textContent = `${currentSpeed}x`;
                speedControl.classList.remove('speed-changing');
            }, 150);
        });

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        }
    });
});