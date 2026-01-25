// Dashboard JavaScript
console.log('Dashboard.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Dashboard');
    // Initialize stats
    let studyStats = JSON.parse(localStorage.getItem('studyStats')) || {
        streak: 0,
        totalSessions: 0,
        totalTime: 0,
        lastStudyDate: null
    };

    // Update stats display
    function updateStatsDisplay() {
        document.getElementById('streak-count').textContent = studyStats.streak;
        document.getElementById('total-sessions').textContent = studyStats.totalSessions;
        document.getElementById('total-time').textContent = Math.floor(studyStats.totalTime / 3600); // hours
    }

    updateStatsDisplay();

    // Pomodoro Timer
    let timer;
    let timeLeft = 25 * 60; // 25 minutes
    let isRunning = false;
    const timerDisplay = document.getElementById('timer-display');
    const timerStatus = document.getElementById('timer-status');
    const startPauseBtn = document.getElementById('start-pause');
    const resetBtn = document.getElementById('reset');
    const increaseBtn = document.getElementById('increase-time');
    const decreaseBtn = document.getElementById('decrease-time');
    const timerCircle = document.getElementById('timer-circle');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        updateCircularProgress();
    }

    function updateCircularProgress() {
        const totalTime = 25 * 60;
        const progress = ((totalTime - timeLeft) / totalTime) * 393; // 393 is circumference for r=62.5
        timerCircle.style.strokeDasharray = `${progress} 393`;
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startPauseBtn.textContent = 'Pause';
            timerStatus.textContent = 'Focus time!';
            timer = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    startPauseBtn.textContent = 'Start';
                    timerStatus.textContent = 'Session complete! Take a break.';
                    completeSession();
                    if (Notification.permission === 'granted') {
                        new Notification('Pomodoro Complete!', { body: 'Time for a break!' });
                    }
                    loadQuote(); // Load new quote after session
                }
            }, 1000);
        } else {
            clearInterval(timer);
            isRunning = false;
            startPauseBtn.textContent = 'Start';
            timerStatus.textContent = 'Paused';
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60;
        updateDisplay();
        startPauseBtn.textContent = 'Start';
        timerStatus.textContent = 'Ready to study!';
    }

    function adjustTime(amount) {
        if (!isRunning) {
            timeLeft += amount * 60;
            if (timeLeft < 60) timeLeft = 60; // Minimum 1 minute
            updateDisplay();
        }
    }

    function completeSession() {
        studyStats.totalSessions++;
        studyStats.totalTime += 25 * 60; // Add 25 minutes

        const today = new Date().toDateString();
        if (studyStats.lastStudyDate === today) {
            // Already studied today, don't increase streak
        } else if (studyStats.lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
            // Studied yesterday, increase streak
            studyStats.streak++;
        } else {
            // Break in streak
            studyStats.streak = 1;
        }
        studyStats.lastStudyDate = today;

        localStorage.setItem('studyStats', JSON.stringify(studyStats));
        updateStatsDisplay();
        checkAchievements();
    }

    startPauseBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    increaseBtn.addEventListener('click', () => adjustTime(5));
    decreaseBtn.addEventListener('click', () => adjustTime(-5));

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // To-Do List
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const todoProgress = document.getElementById('todo-progress');
    const todoStats = document.getElementById('todo-stats');

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todoList.innerHTML = '';
        let completed = 0;
        todos.forEach((todo, index) => {
            if (todo.completed) completed++;
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${todo.text}</span>
                <div>
                    <button class="todo-toggle-btn" data-index="${index}">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button class="todo-delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });

        // Add event listeners for todo buttons
        document.querySelectorAll('.todo-toggle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                toggleTodo(index);
            });
        });

        document.querySelectorAll('.todo-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteTodo(index);
            });
        });

        updateTodoProgress(todos.length, completed);
    }

    function updateTodoProgress(total, completed) {
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        todoProgress.style.width = `${percentage}%`;
        todoStats.textContent = `${completed} / ${total} tasks completed`;
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            todos.push({ text, completed: false });
            localStorage.setItem('todos', JSON.stringify(todos));
            todoInput.value = '';
            loadTodos();
        }
    }

    window.toggleTodo = function(index) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos[index].completed = !todos[index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    };

    window.deleteTodo = function(index) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    };

    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });

    loadTodos();

    // Ambient Sounds - YouTube IFrame Player API
    let player;
    const playPauseBtn = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume');
    const soundSelect = document.getElementById('sound-select');
    const playerStatus = document.getElementById('player-status');
    const testChangeBtn = document.getElementById('test-change');

    console.log('Sound elements found:', {
        playPauseBtn: !!playPauseBtn,
        volumeSlider: !!volumeSlider,
        soundSelect: !!soundSelect,
        playerStatus: !!playerStatus,
        testChangeBtn: !!testChangeBtn
    });

    // Initialize YouTube Player
    function onYouTubeIframeAPIReady() {
        try {
            player = new YT.Player('youtube-player', {
                height: '200',
                width: '300',
                videoId: 'jfKfPfyJRdk',
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'disablekb': 1,
                    'enablejsapi': 1,
                    'loop': 1,
                    'modestbranding': 1,
                    'rel': 0,
                    'showinfo': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
        } catch (error) {
            console.warn('YouTube Player failed to initialize:', error);
            // Fallback: disable controls
            playPauseBtn.disabled = true;
            volumeSlider.disabled = true;
            playPauseBtn.textContent = 'Unavailable';
            playerStatus.textContent = 'Player unavailable';
            playerStatus.style.color = 'var(--danger-color)';
        }
    }

    function onPlayerReady(event) {
        console.log('YouTube player is ready!');
        // Player is ready
        updateVolume();
        playPauseBtn.disabled = false;
        volumeSlider.disabled = false;
        playerStatus.textContent = 'Ready to play';
        playerStatus.style.color = 'var(--success-color)';

        // Load the initial video
        console.log('Loading initial video...');
        player.loadVideoById('jfKfPfyJRdk');

        // Set up event listeners now that player is ready
        setupEventListeners();
    }

    function setupEventListeners() {
        soundSelect.addEventListener('change', function() {
            console.log('Dropdown changed! Selected value:', this.value);
            const videoId = this.value;
            const selectedOption = this.options[this.selectedIndex];
            const videoTitle = selectedOption.text;

            console.log('Changing to video:', videoId, videoTitle);

            if (player && typeof player.loadVideoById === 'function') {
                try {
                    // Show loading state
                    playPauseBtn.textContent = 'Loading...';
                    playPauseBtn.disabled = true;
                    playerStatus.textContent = `Loading ${videoTitle}...`;
                    playerStatus.style.color = 'var(--accent-color)';

                    // Stop current video first
                    player.stopVideo();

                    // Load new video
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: 0
                    });

                    console.log('Video load initiated for:', videoId);

                    // Set a timeout to check if video loaded successfully
                    setTimeout(() => {
                        try {
                            const state = player.getPlayerState();
                            console.log('Player state after load:', state);
                            if (state === YT.PlayerState.UNSTARTED) {
                                // Video failed to load, try to play it
                                console.log('Attempting to play video...');
                                player.playVideo();
                            } else {
                                // Video loaded successfully
                                playPauseBtn.disabled = false;
                                playPauseBtn.textContent = 'Pause'; // Assume it auto-played
                            }
                        } catch (e) {
                            console.warn('Error checking player state:', e);
                        }
                    }, 2000);

                } catch (error) {
                    console.warn('Failed to load video via API:', videoTitle, error);
                    // Fallback: try iframe src method
                    console.log('Trying iframe fallback...');
                    fallbackLoadVideo(videoId, videoTitle);
                }
            } else {
                console.warn('Player not ready or loadVideoById not available, using fallback');
                fallbackLoadVideo(videoId, videoTitle);
            }
        });

        function fallbackLoadVideo(videoId, videoTitle) {
            try {
                const iframe = document.getElementById('youtube-player');
                iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0`;
                playerStatus.textContent = `Loaded ${videoTitle} (fallback)`;
                playerStatus.style.color = 'var(--success-color)';
                playPauseBtn.disabled = false;
                playPauseBtn.textContent = 'Play';
                console.log('Fallback video load successful for:', videoId);
            } catch (error) {
                console.warn('Fallback video load failed:', error);
                playerStatus.textContent = `Failed to load ${videoTitle}`;
                playerStatus.style.color = 'var(--danger-color)';
            }
        }

        playPauseBtn.addEventListener('click', function() {
            if (player && !playPauseBtn.disabled) {
                try {
                    const state = player.getPlayerState();
                    console.log('Play/pause clicked, current state:', state);
                    if (state === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                    } else {
                        player.playVideo();
                    }
                } catch (error) {
                    console.warn('Player control error:', error);
                }
            }
        });

        volumeSlider.addEventListener('input', updateVolume);

        // Test button for debugging
        if (testChangeBtn) {
            testChangeBtn.addEventListener('click', function() {
                console.log('Test button clicked - changing to Jazz via API');
                soundSelect.value = 'lTRiuFIWV54'; // Smooth Jazz
                soundSelect.dispatchEvent(new Event('change'));
            });
        }
    }

    function onPlayerStateChange(event) {
        console.log('Player state changed to:', event.data);
        if (event.data == YT.PlayerState.PLAYING) {
            playPauseBtn.textContent = 'Pause';
            playerStatus.textContent = 'Playing';
            playerStatus.style.color = 'var(--success-color)';
        } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
            playPauseBtn.textContent = 'Play';
            playerStatus.textContent = 'Paused';
            playerStatus.style.color = 'var(--text-color)';
        } else if (event.data == YT.PlayerState.BUFFERING) {
            playerStatus.textContent = 'Loading...';
            playerStatus.style.color = 'var(--accent-color)';
        } else if (event.data == YT.PlayerState.UNSTARTED) {
            playerStatus.textContent = 'Ready to play';
            playerStatus.style.color = 'var(--text-color)';
        }
    }

    function onPlayerError(event) {
        console.warn('YouTube Player Error:', event.data);
        playPauseBtn.textContent = 'Error';
        playPauseBtn.disabled = true;

        // Update status
        playerStatus.textContent = 'Video unavailable';
        playerStatus.style.color = 'var(--danger-color)';

        // Try to automatically load the next available video
        const currentIndex = soundSelect.selectedIndex;
        const nextIndex = (currentIndex + 1) % soundSelect.options.length;

        if (nextIndex !== currentIndex) {
            console.log('Trying next video option...');
            playerStatus.textContent = 'Trying next option...';
            setTimeout(() => {
                soundSelect.selectedIndex = nextIndex;
                soundSelect.dispatchEvent(new Event('change'));
            }, 2000);
        } else {
            // All options exhausted
            playerStatus.textContent = 'All videos unavailable';
            alert('All study music options appear to be unavailable. Please check your internet connection.');
        }
    }

    function updateVolume() {
        if (player && player.setVolume && !volumeSlider.disabled) {
            try {
                player.setVolume(volumeSlider.value);
            } catch (error) {
                console.warn('Volume control error:', error);
            }
        }
    }

    // Initialize player when API is ready
    if (typeof YT !== 'undefined' && YT.Player) {
        console.log('YouTube API already loaded, initializing player...');
        onYouTubeIframeAPIReady();
    } else {
        console.log('YouTube API not loaded yet, waiting...');
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        // Fallback timeout in case API doesn't load
        setTimeout(() => {
            if (!player) {
                console.warn('YouTube API failed to load, disabling player controls');
                playPauseBtn.disabled = true;
                volumeSlider.disabled = true;
                playPauseBtn.textContent = 'Unavailable';
                playerStatus.textContent = 'API unavailable';
                playerStatus.style.color = 'var(--danger-color)';
            }
        }, 10000);
    }

    // Achievements
    const achievements = [
        { id: 'first_session', name: 'First Steps', description: 'Complete your first study session', condition: (stats) => stats.totalSessions >= 1 },
        { id: 'five_sessions', name: 'Getting Started', description: 'Complete 5 study sessions', condition: (stats) => stats.totalSessions >= 5 },
        { id: 'streak_3', name: 'Consistency', description: 'Maintain a 3-day study streak', condition: (stats) => stats.streak >= 3 },
        { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day study streak', condition: (stats) => stats.streak >= 7 },
        { id: 'ten_hours', name: 'Dedicated', description: 'Study for 10 hours total', condition: (stats) => stats.totalTime >= 36000 }
    ];

    let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

    function checkAchievements() {
        achievements.forEach(achievement => {
            if (!unlockedAchievements.includes(achievement.id) && achievement.condition(studyStats)) {
                unlockedAchievements.push(achievement.id);
                showAchievementModal(achievement);
            }
        });
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    }

    function showAchievementModal(achievement) {
        const modal = document.getElementById('achievement-modal');
        const list = document.getElementById('achievement-list');
        list.innerHTML = `<div class="achievement-item">
            <h3>🏆 ${achievement.name}</h3>
            <p>${achievement.description}</p>
        </div>`;
        modal.style.display = 'block';
    }

    document.getElementById('view-achievements').addEventListener('click', function() {
        const modal = document.getElementById('achievement-modal');
        const list = document.getElementById('achievement-list');
        list.innerHTML = unlockedAchievements.length > 0 ?
            unlockedAchievements.map(id => {
                const achievement = achievements.find(a => a.id === id);
                return `<div class="achievement-item">
                    <h3>🏆 ${achievement.name}</h3>
                    <p>${achievement.description}</p>
                </div>`;
            }).join('') :
            '<p>No achievements unlocked yet. Keep studying!</p>';
        modal.style.display = 'block';
    });

    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('achievement-modal').style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        const modal = document.getElementById('achievement-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Motivational Quote
    function loadQuote() {
        fetch('data/quotes.json')
            .then(response => response.json())
            .then(quotes => {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                document.getElementById('quote-text').textContent = randomQuote;
            });
    }

    document.getElementById('new-quote').addEventListener('click', loadQuote);

    loadQuote();
});