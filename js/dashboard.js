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

    // Initialize timer display
    updateDisplay();

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

    // YouTube IFrame Player API - IMPROVED VERSION
    let player;
    const playPauseBtn = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume');
    const soundSelect = document.getElementById('sound-select');
    const playerStatus = document.getElementById('player-status');

    console.log('Sound elements found:', {
        playPauseBtn: !!playPauseBtn,
        volumeSlider: !!volumeSlider,
        soundSelect: !!soundSelect,
        playerStatus: !!playerStatus
    });

    function fallbackLoadVideo(videoId, videoTitle) {
        try {
            console.log('Using iframe fallback for:', videoId);
            const iframe = document.getElementById('youtube-player');
            iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&autoplay=0&loop=1&playlist=${videoId}`;
            playerStatus.textContent = `${videoTitle}`;
            playerStatus.style.color = 'var(--success-color)';
            playPauseBtn.disabled = false;
            playPauseBtn.textContent = 'Play';
            console.log('Fallback video load successful for:', videoId);
        } catch (error) {
            console.warn('Fallback video load failed:', error);
            playerStatus.textContent = `Failed to load`;
            playerStatus.style.color = 'var(--danger-color)';
            playPauseBtn.disabled = true;
        }
    }

    function updateVolume() {
        if (player && typeof player.setVolume === 'function') {
            try {
                player.setVolume(volumeSlider.value);
                console.log('Volume set to:', volumeSlider.value);
            } catch (error) {
                console.warn('Volume control error:', error);
            }
        }
    }

    function onPlayerStateChange(event) {
        console.log('Player state changed to:', event.data);
        const state = event.data;
        if (state === YT.PlayerState.PLAYING) {
            playPauseBtn.textContent = 'Pause';
            playerStatus.textContent = 'Playing';
            playerStatus.style.color = 'var(--success-color)';
        } else if (state === YT.PlayerState.PAUSED) {
            playPauseBtn.textContent = 'Play';
            playerStatus.textContent = 'Paused';
            playerStatus.style.color = 'var(--text-color)';
        } else if (state === YT.PlayerState.ENDED) {
            playPauseBtn.textContent = 'Play';
            playerStatus.textContent = 'Ended';
            playerStatus.style.color = 'var(--text-color)';
        } else if (state === YT.PlayerState.BUFFERING) {
            playerStatus.textContent = 'Loading...';
            playerStatus.style.color = 'var(--accent-color)';
        } else if (state === YT.PlayerState.UNSTARTED) {
            playerStatus.textContent = 'Ready to play';
            playerStatus.style.color = 'var(--text-color)';
        }
    }

    function onPlayerError(event) {
        console.error('YouTube Player Error:', event.data);
        const errorCode = event.data;
        let errorMessage = 'Video unavailable';

        switch(errorCode) {
            case 2:
                errorMessage = 'Invalid video ID';
                break;
            case 5:
                errorMessage = 'HTML5 player error';
                break;
            case 100:
                errorMessage = 'Video not found';
                break;
            case 101:
            case 150:
                errorMessage = 'Video embedding disabled';
                break;
        }

        playerStatus.textContent = errorMessage;
        playerStatus.style.color = 'var(--danger-color)';
        playPauseBtn.disabled = true;
    }

    function onPlayerReady(event) {
        console.log('YouTube player is ready!');
        try {
            updateVolume();
            playPauseBtn.disabled = false;
            volumeSlider.disabled = false;
            playerStatus.textContent = 'Ready to play';
            playerStatus.style.color = 'var(--success-color)';

            // Set up event listeners after player is ready
            setupPlayerEventListeners();
        } catch (error) {
            console.error('Error in onPlayerReady:', error);
            playerStatus.textContent = 'Player initialization error';
            playerStatus.style.color = 'var(--danger-color)';
        }
    }

    function setupPlayerEventListeners() {
        // Volume slider
        volumeSlider.addEventListener('input', updateVolume);

        // Sound selector
        soundSelect.addEventListener('change', function() {
            const videoId = this.value;
            const selectedOption = this.options[this.selectedIndex];
            const videoTitle = selectedOption.text;

            console.log('Sound changed to:', videoId, videoTitle);

            if (player && typeof player.loadVideoById === 'function') {
                try {
                    playPauseBtn.textContent = 'Loading...';
                    playPauseBtn.disabled = true;
                    playerStatus.textContent = `Loading...`;
                    playerStatus.style.color = 'var(--accent-color)';

                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: 0
                    });

                    console.log('Loading via API:', videoId);
                } catch (error) {
                    console.warn('API load failed, using fallback:', error);
                    fallbackLoadVideo(videoId, videoTitle);
                }
            } else {
                console.warn('Player not ready, using fallback');
                fallbackLoadVideo(videoId, videoTitle);
            }
        });

        // Play/Pause button
        playPauseBtn.addEventListener('click', function() {
            if (player && !playPauseBtn.disabled) {
                try {
                    const state = player.getPlayerState();
                    console.log('Play/pause clicked, current state:', state);
                    if (state === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                        playPauseBtn.textContent = 'Play';
                        playerStatus.textContent = 'Paused';
                        playerStatus.style.color = 'var(--text-color)';
                    } else {
                        player.playVideo();
                        playPauseBtn.textContent = 'Pause';
                        playerStatus.textContent = 'Playing';
                        playerStatus.style.color = 'var(--success-color)';
                    }
                } catch (error) {
                    console.warn('Player control error:', error);
                    playerStatus.textContent = 'Control error';
                    playerStatus.style.color = 'var(--danger-color)';
                }
            }
        });

        // Test button for debugging
        const testChangeBtn = document.getElementById('test-change');
        if (testChangeBtn) {
            testChangeBtn.addEventListener('click', function() {
                console.log('Test button clicked');
                soundSelect.value = 'lTRiuFIWV54';
                soundSelect.dispatchEvent(new Event('change'));
            });
        }
    }

    // Initialize YouTube Player when API is ready
    window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube API ready, creating player...');
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
                    'showinfo': 0,
                    'playlist': 'jfKfPfyJRdk'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
            console.log('YouTube player created successfully');
        } catch (error) {
            console.error('Failed to create YouTube player:', error);
            playerStatus.textContent = 'Player creation failed';
            playerStatus.style.color = 'var(--danger-color)';
            playPauseBtn.disabled = true;
            volumeSlider.disabled = true;
        }
    };

    // Fallback timeout in case API doesn't load
    setTimeout(() => {
        if (!player) {
            console.warn('YouTube API failed to load, switching to fallback mode');
            playerStatus.textContent = 'Using basic player';
            playerStatus.style.color = 'var(--accent-color)';
            
            // Set up fallback mode with iframe only
            soundSelect.addEventListener('change', function() {
                const videoId = this.value;
                const selectedOption = this.options[this.selectedIndex];
                const videoTitle = selectedOption.text;
                fallbackLoadVideo(videoId, videoTitle);
            });

            playPauseBtn.addEventListener('click', function() {
                const iframe = document.getElementById('youtube-player');
                if (iframe.style.display !== 'none') {
                    // Can't directly control iframe, so just notify user
                    alert('Use YouTube player controls to play/pause');
                }
            });

            volumeSlider.addEventListener('input', function() {
                // Can't control volume in fallback, just show slider
                console.log('Volume slider (fallback):', this.value);
            });
        }
    }, 8000);

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