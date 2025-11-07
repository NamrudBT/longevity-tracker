// Longevity Protocol Tracker - Main Application
// Version 1.0.0

// ============================================================================
// DATA STRUCTURES & STATE
// ============================================================================

const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'longevity_tracker_data';

// Global app state
const state = {
    currentView: 'today',
    startDate: null,
    currentWeek: 1,
    currentPhase: null,
    activeWorkout: null,
    userData: {
        profileEmail: '',
        partnerEmail: '',
        healthMetrics: [],
        workoutHistory: [],
        habits: []
    }
};

// Phase definitions
const PHASES = {
    PHASE_ZERO: { name: 'Phase Zero: Medical Clearance', weeks: [1, 2, 3, 4], color: '#FF9800' },
    FOUNDATION: { name: 'Foundation & Rehabilitation', weeks: Array.from({length: 12}, (_, i) => i + 1), color: '#4CAF50' },
    STRENGTH: { name: 'Strength Endurance', weeks: Array.from({length: 12}, (_, i) => i + 13), color: '#2196F3' },
    HYPERTROPHY: { name: 'Accelerated Hypertrophy (OSM)', weeks: [25, 26, 27, 28, 29, 30, 31, 32], color: '#FF4D4D' },
    INTEGRATION: { name: 'Integration & Longevity', weeks: Array.from({length: 20}, (_, i) => i + 33), color: '#9C27B0' }
};

// Exercise database with safety classifications
const EXERCISES = {
    // SAFE exercises (scoliosis-friendly, no axial load)
    safe: [
        { id: 'goblet-squat', name: 'Goblet Squat', category: 'lower', video: 'https://www.youtube.com/watch?v=rVwJlgO_TWY' },
        { id: 'split-squat', name: 'Split Squats (Dumbbells)', category: 'lower', video: '' },
        { id: 'db-rdl', name: 'Dumbbell Romanian Deadlift', category: 'lower', video: '' },
        { id: 'leg-press', name: 'Leg Press', category: 'lower', video: '' },
        { id: 'bridge-ball', name: 'Bridge with Ball', category: 'lower', video: '' },
        { id: 'side-leg-raises', name: 'Side Leg Raises', category: 'lower', video: '' },
        { id: 'db-chest-press', name: 'Dumbbell Chest Press (Flat)', category: 'push', video: 'https://www.youtube.com/watch?v=pKZMNVbfUzQ' },
        { id: 'db-incline-press', name: 'Dumbbell Chest Press (Incline)', category: 'push', video: '' },
        { id: 'pushups', name: 'Push-ups', category: 'push', video: '' },
        { id: 'pushups-modified', name: 'Modified Push-ups', category: 'push', video: '' },
        { id: 'single-arm-row', name: 'Single-Arm Dumbbell Row', category: 'pull', video: 'https://www.youtube.com/watch?v=TYmOeShOIpA' },
        { id: 'cable-row', name: 'Seated Cable Row', category: 'pull', video: '' },
        { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'pull', video: '' },
        { id: 'db-shoulder-press', name: 'Seated Dumbbell Military Press', category: 'shoulders', video: 'https://www.youtube.com/watch?v=gfUg6qWohTk' },
        { id: 'pallof-press', name: 'Pallof Press', category: 'core', video: 'https://www.youtube.com/watch?v=cwL4V7ilbAs' },
        { id: 'side-plank', name: 'Side Plank', category: 'core', video: '' },
        { id: 'ab-cylinder', name: 'Abdominal Cylinder Exercise', category: 'core', video: 'https://www.youtube.com/watch?v=9wYUawp_lSg' },
        { id: 'pelvic-tilts', name: 'Pelvic Tilts (Supine)', category: 'core', video: '' },
        { id: 'cat-cow', name: 'Cat/Cow Pose', category: 'mobility', video: '' },
        { id: 'ez-curl', name: 'EZ Bar Curl', category: 'arms', video: '' },
        { id: 'db-curl', name: 'Dumbbell Curl', category: 'arms', video: '' },
        { id: 'tricep-pressdown', name: 'Rope Press-downs', category: 'arms', video: '' },
        { id: 'db-skullcrusher', name: 'Dumbbell Skull Crushers', category: 'arms', video: '' }
    ],
    // CONTRAINDICATED exercises (must avoid)
    contraindicated: [
        { id: 'barbell-squat', name: 'Barbell Back Squat', reason: 'High axial load - risk to scoliotic spine' },
        { id: 'deadlift', name: 'Conventional Deadlift', reason: 'High axial load and potential asymmetric loading' },
        { id: 'russian-twist', name: 'Russian Twists', reason: 'Heavy twisting - risk to scoliotic curve' },
        { id: 'barbell-row-bent', name: 'Heavy Bent-Over Barbell Row', reason: 'Spinal flexion under load' }
    ]
};

// Workout templates by phase
const WORKOUT_TEMPLATES = {
    foundation: {
        frequency: 3,
        structure: 'Full Body A/B/C',
        intensity: 'RPE 4-6',
        reps: '12-15',
        rest: '60-90s',
        exercises: {
            warmup: ['cat-cow', 'pelvic-tilts', 'ab-cylinder'],
            main: ['goblet-squat', 'pushups-modified', 'single-arm-row', 'side-leg-raises']
        }
    },
    strength: {
        frequency: 4,
        structure: 'Upper/Lower Split',
        intensity: 'RPE 6-7',
        reps: '8-12',
        rest: '90-120s',
        exercises: {
            lower: ['goblet-squat', 'db-rdl', 'split-squat', 'bridge-ball'],
            upper: ['db-chest-press', 'single-arm-row', 'db-shoulder-press', 'pallof-press']
        }
    },
    hypertrophy: {
        frequency: 3,
        structure: 'Full Body A/B/C (OSM)',
        intensity: 'RPE 7-8',
        reps: 'Varied 6-20',
        rest: '60-90s',
        exercises: {
            heavy: ['goblet-squat', 'db-chest-press', 'single-arm-row', 'db-shoulder-press'],
            light: ['leg-press', 'db-incline-press', 'lat-pulldown'],
            moderate: ['split-squat', 'pushups', 'cable-row']
        }
    },
    integration: {
        frequency: 4,
        structure: 'Undulating Intensity',
        intensity: 'RPE 5-8',
        reps: 'Varies weekly',
        rest: 'Varies',
        exercises: {
            strength: ['goblet-squat', 'single-arm-row'],
            hypertrophy: ['db-rdl', 'db-chest-press'],
            endurance: ['split-squat', 'db-shoulder-press']
        }
    }
};

// Default habits for tracking
const DEFAULT_HABITS = [
    { id: 'workout', name: 'Complete Workout', icon: '🏋️', completed: false },
    { id: 'cardio', name: '3x10 Cardio (if scheduled)', icon: '🏃', completed: false },
    { id: 'bp-check', name: 'Blood Pressure Check', icon: '🩺', completed: false },
    { id: 'hydration', name: '3-4L Water Intake', icon: '💧', completed: false },
    { id: 'no-smoking', name: 'Smoke-Free Day', icon: '🚭', completed: false },
    { id: 'no-alcohol', name: 'Alcohol-Free Day', icon: '🍺', completed: false },
    { id: 'mobility', name: '15-20 Min Stretching', icon: '🧘', completed: false }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    console.log('Initializing Longevity Protocol Tracker v' + APP_VERSION);
    
    // Load saved data
    loadData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize views
    updateCurrentDate();
    calculateCurrentPhase();
    renderTodayView();
    renderHabits();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }, 1500);
}

// ============================================================================
// DATA PERSISTENCE
// ============================================================================

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(state, data);
            console.log('Data loaded successfully');
        } else {
            // First time user - set defaults
            state.startDate = new Date().toISOString().split('T')[0];
            state.currentWeek = 1;
            state.userData.habits = DEFAULT_HABITS.map(h => ({...h}));
            saveData();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Reset to defaults on error
        state.startDate = new Date().toISOString().split('T')[0];
        state.currentWeek = 1;
        state.userData.habits = DEFAULT_HABITS.map(h => ({...h}));
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data. Please check your storage settings.');
    }
}

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `longevity-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            Object.assign(state, imported);
            saveData();
            location.reload();
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Failed to import data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    // Today view buttons
    document.getElementById('start-workout-btn')?.addEventListener('click', startWorkout);
    document.getElementById('log-metrics-btn')?.addEventListener('click', () => openHealthMetricsModal());
    
    // Workout view buttons
    document.getElementById('select-workout-btn')?.addEventListener('click', () => openWorkoutSelectionModal());
    document.getElementById('browse-workouts-btn')?.addEventListener('click', () => openWorkoutSelectionModal());
    
    // Progress view tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Health view buttons
    document.getElementById('add-health-entry-btn')?.addEventListener('click', () => openHealthMetricsModal());
    
    // Settings buttons
    document.getElementById('save-settings-btn')?.addEventListener('click', saveSettings);
    document.getElementById('export-data-btn')?.addEventListener('click', exportData);
    document.getElementById('import-data-btn')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => importData(e.target.files[0]);
        input.click();
    });
    document.getElementById('clear-data-btn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });
    
    // Modal overlay click to close
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
}

// ============================================================================
// NAVIGATION & VIEW MANAGEMENT
// ============================================================================

function switchView(viewName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });
    
    state.currentView = viewName;
    
    // Render view-specific content
    if (viewName === 'today') {
        renderTodayView();
    } else if (viewName === 'progress') {
        renderProgressView();
    } else if (viewName === 'health') {
        renderHealthView();
    } else if (viewName === 'settings') {
        renderSettingsView();
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Render tab-specific content
    if (tabName === 'strength') {
        renderStrengthProgress();
    } else if (tabName === 'health') {
        renderHealthProgress();
    } else if (tabName === 'behavior') {
        renderBehaviorProgress();
    }
}

// ============================================================================
// TODAY VIEW
// ============================================================================

function renderTodayView() {
    updateCurrentDate();
    renderPhaseCard();
    renderTodayWorkout();
    renderTodayMetrics();
    renderHabits();
}

function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

function calculateCurrentPhase() {
    const week = state.currentWeek;
    
    if (week <= 4) {
        state.currentPhase = 'PHASE_ZERO';
    } else if (week <= 12) {
        state.currentPhase = 'FOUNDATION';
    } else if (week <= 24) {
        state.currentPhase = 'STRENGTH';
    } else if (week <= 32) {
        state.currentPhase = 'HYPERTROPHY';
    } else {
        state.currentPhase = 'INTEGRATION';
    }
    
    return PHASES[state.currentPhase];
}

function renderPhaseCard() {
    const phase = calculateCurrentPhase();
    const weekProgress = ((state.currentWeek - 1) / 52) * 100;
    
    document.getElementById('current-phase-name').textContent = phase.name;
    document.getElementById('current-week').textContent = state.currentWeek;
    document.getElementById('phase-progress-fill').style.width = weekProgress + '%';
    document.getElementById('phase-progress-percent').textContent = Math.round(weekProgress);
}

function renderTodayWorkout() {
    const container = document.getElementById('today-workout-content');
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Determine if today is a workout day based on current phase
    const phase = calculateCurrentPhase();
    let isWorkoutDay = false;
    let workoutType = '';
    
    if (state.currentPhase === 'FOUNDATION') {
        // 3 days per week (Mon, Wed, Fri)
        isWorkoutDay = [1, 3, 5].includes(today);
        workoutType = 'Full Body';
    } else if (state.currentPhase === 'STRENGTH') {
        // 4 days per week (Mon, Tue, Thu, Fri)
        isWorkoutDay = [1, 2, 4, 5].includes(today);
        workoutType = today === 1 || today === 4 ? 'Lower Body' : 'Upper Body';
    } else if (state.currentPhase === 'HYPERTROPHY') {
        // 3 days per week (Mon, Wed, Fri)
        isWorkoutDay = [1, 3, 5].includes(today);
        const dayIndex = [1, 3, 5].indexOf(today);
        workoutType = ['Heavy', 'Light', 'Moderate'][dayIndex] + ' Full Body';
    } else if (state.currentPhase === 'INTEGRATION') {
        // 4 days per week
        isWorkoutDay = [1, 2, 4, 5].includes(today);
        workoutType = 'Undulating Intensity';
    }
    
    if (isWorkoutDay) {
        container.innerHTML = `
            <div class="workout-preview-content">
                <h3>${workoutType}</h3>
                <p class="workout-description">
                    ${getWorkoutDescription(state.currentPhase, workoutType)}
                </p>
                <div class="workout-stats">
                    <div class="workout-stat">
                        <span class="stat-label">Target RPE</span>
                        <span class="stat-value">${getTargetRPE(state.currentPhase)}</span>
                    </div>
                    <div class="workout-stat">
                        <span class="stat-label">Estimated Time</span>
                        <span class="stat-value">${getEstimatedTime(state.currentPhase)}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💤</div>
                <p>Rest day or cardio day</p>
                <p class="text-secondary">Focus on 3x10 cardio if scheduled</p>
            </div>
        `;
    }
}

function getWorkoutDescription(phase, type) {
    const descriptions = {
        PHASE_ZERO: 'Medical clearance and light mobility work',
        FOUNDATION: 'Focus on form, stability, and building the habit',
        STRENGTH: 'Moderate loads with longer rest periods',
        HYPERTROPHY: 'Reverse pyramid sets for muscle growth',
        INTEGRATION: 'Varied intensity to maintain adaptations'
    };
    return descriptions[phase] || 'Follow your programmed workout';
}

function getTargetRPE(phase) {
    const rpe = {
        PHASE_ZERO: '2-4',
        FOUNDATION: '4-6',
        STRENGTH: '6-7',
        HYPERTROPHY: '7-8',
        INTEGRATION: '5-8'
    };
    return rpe[phase] || '5-7';
}

function getEstimatedTime(phase) {
    const times = {
        PHASE_ZERO: '20-30 min',
        FOUNDATION: '45-60 min',
        STRENGTH: '60-75 min',
        HYPERTROPHY: '60-90 min',
        INTEGRATION: '45-75 min'
    };
    return times[phase] || '60 min';
}

function renderTodayMetrics() {
    // Get today's metrics
    const today = new Date().toISOString().split('T')[0];
    const todayMetrics = state.userData.healthMetrics.find(m => m.date === today);
    
    // Update display
    if (todayMetrics) {
        if (todayMetrics.bloodPressure) {
            document.getElementById('bp-value').textContent = 
                `${todayMetrics.bloodPressure.systolic}/${todayMetrics.bloodPressure.diastolic}`;
        }
        if (todayMetrics.weight) {
            document.getElementById('weight-value').textContent = 
                `${todayMetrics.weight} lbs`;
        }
    }
    
    // Calculate streak days
    const smokeFree = calculateStreakDays('smokeFree');
    const alcoholFree = calculateStreakDays('alcoholFree');
    
    document.getElementById('smoke-free-days').textContent = smokeFree;
    document.getElementById('alcohol-free-days').textContent = alcoholFree;
}

function calculateStreakDays(type) {
    const metrics = state.userData.healthMetrics
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    for (const metric of metrics) {
        if (metric[type] === true) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function renderHabits() {
    const container = document.getElementById('habits-list');
    if (!container) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Reset habits if it's a new day
    const lastHabitDate = localStorage.getItem('lastHabitDate');
    if (lastHabitDate !== today) {
        state.userData.habits.forEach(h => h.completed = false);
        localStorage.setItem('lastHabitDate', today);
        saveData();
    }
    
    container.innerHTML = state.userData.habits.map(habit => `
        <div class="habit-item ${habit.completed ? 'completed' : ''}" data-habit-id="${habit.id}">
            <div class="habit-info">
                <span class="habit-icon">${habit.icon}</span>
                <span class="habit-name">${habit.name}</span>
            </div>
            <div class="habit-checkbox">
                ${habit.completed ? '✓' : ''}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.habit-item').forEach(item => {
        item.addEventListener('click', () => toggleHabit(item.dataset.habitId));
    });
}

function toggleHabit(habitId) {
    const habit = state.userData.habits.find(h => h.id === habitId);
    if (habit) {
        habit.completed = !habit.completed;
        saveData();
        renderHabits();
        
        // Provide feedback
        if (habit.completed) {
            showNotification(`✓ ${habit.name}`, 'success');
        }
    }
}

// ============================================================================
// WORKOUT FUNCTIONALITY
// ============================================================================

function startWorkout() {
    // Get today's workout template
    const phase = state.currentPhase.toLowerCase();
    const template = WORKOUT_TEMPLATES[phase];
    
    if (!template) {
        alert('No workout template found for current phase');
        return;
    }
    
    // Create workout session
    state.activeWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        phase: state.currentPhase,
        week: state.currentWeek,
        exercises: [],
        completed: false,
        startTime: new Date().toISOString()
    };
    
    // Switch to workout view and show workout builder
    switchView('workout');
    openWorkoutBuilder(template);
}

function openWorkoutBuilder(template) {
    const container = document.getElementById('workout-content');
    
    container.innerHTML = `
        <div class="workout-builder">
            <div class="workout-header">
                <h2>Build Your Workout</h2>
                <p>Select exercises for today's ${template.structure} workout</p>
            </div>
            
            <div class="exercise-selection">
                <h3>Select Exercises</h3>
                <div id="exercise-list" class="exercise-list">
                    ${renderExerciseSelectionList(template)}
                </div>
            </div>
            
            <div class="workout-actions">
                <button class="btn-secondary" onclick="cancelWorkout()">Cancel</button>
                <button class="btn-primary" onclick="beginWorkout()">Begin Workout</button>
            </div>
        </div>
    `;
}

function renderExerciseSelectionList(template) {
    const safeExercises = EXERCISES.safe;
    
    return safeExercises.map(exercise => `
        <div class="exercise-item" data-exercise-id="${exercise.id}" onclick="toggleExerciseSelection('${exercise.id}')">
            <div class="exercise-name">${exercise.name}</div>
            <div class="exercise-meta">
                <span class="exercise-tag safe">✓ Safe</span>
                <span>${exercise.category}</span>
            </div>
        </div>
    `).join('');
}

function toggleExerciseSelection(exerciseId) {
    const item = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    item.classList.toggle('selected');
}

function beginWorkout() {
    const selected = Array.from(document.querySelectorAll('.exercise-item.selected'))
        .map(item => item.dataset.exerciseId);
    
    if (selected.length === 0) {
        alert('Please select at least one exercise');
        return;
    }
    
    // Build workout with selected exercises
    state.activeWorkout.exercises = selected.map(id => {
        const exercise = EXERCISES.safe.find(e => e.id === id);
        return {
            id: exercise.id,
            name: exercise.name,
            sets: []
        };
    });
    
    renderActiveWorkout();
}

function renderActiveWorkout() {
    const container = document.getElementById('workout-content');
    const workout = state.activeWorkout;
    
    container.innerHTML = `
        <div class="active-workout">
            <div class="workout-summary">
                <h2>Workout in Progress</h2>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <div class="summary-value" id="workout-duration">0:00</div>
                        <div class="summary-label">Duration</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-value">${workout.exercises.length}</div>
                        <div class="summary-label">Exercises</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-value" id="sets-completed">0</div>
                        <div class="summary-label">Sets Done</div>
                    </div>
                </div>
            </div>
            
            <div class="exercise-tracker" id="exercise-tracker">
                ${workout.exercises.map((ex, idx) => renderExerciseTracker(ex, idx)).join('')}
            </div>
            
            <div class="workout-actions">
                <button class="btn-danger" onclick="cancelWorkout()">Cancel Workout</button>
                <button class="btn-primary" onclick="completeWorkout()">Complete Workout</button>
            </div>
        </div>
    `;
    
    // Start timer
    startWorkoutTimer();
}

function renderExerciseTracker(exercise, index) {
    const numSets = 3; // Default 3 sets
    
    return `
        <div class="exercise-section">
            <h3>${exercise.name}</h3>
            <div class="sets-container">
                ${Array.from({length: numSets}, (_, i) => renderSetTracker(exercise.id, i + 1)).join('')}
            </div>
            <button class="btn-secondary" onclick="addSet('${exercise.id}')">+ Add Set</button>
        </div>
    `;
}

function renderSetTracker(exerciseId, setNumber) {
    return `
        <div class="set-tracker" data-exercise="${exerciseId}" data-set="${setNumber}">
            <div class="set-header">
                <span class="set-number">Set ${setNumber}</span>
                <span class="set-status pending">Pending</span>
            </div>
            <div class="set-inputs">
                <div class="set-input-group">
                    <label class="set-input-label">Weight</label>
                    <input type="number" class="set-input" placeholder="lbs" data-field="weight">
                </div>
                <div class="set-input-group">
                    <label class="set-input-label">Reps</label>
                    <input type="number" class="set-input" placeholder="0" data-field="reps">
                </div>
                <div class="set-input-group">
                    <label class="set-input-label">RPE</label>
                    <input type="number" class="set-input" placeholder="1-10" min="1" max="10" data-field="rpe">
                </div>
            </div>
        </div>
    `;
}

let workoutTimer;
function startWorkoutTimer() {
    const startTime = new Date(state.activeWorkout.startTime);
    workoutTimer = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('workout-duration').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function addSet(exerciseId) {
    const exercise = state.activeWorkout.exercises.find(e => e.id === exerciseId);
    const container = document.querySelector(`[data-exercise="${exerciseId}"]`).closest('.exercise-section').querySelector('.sets-container');
    const setNumber = container.querySelectorAll('.set-tracker').length + 1;
    
    const newSet = renderSetTracker(exerciseId, setNumber);
    container.insertAdjacentHTML('beforeend', newSet);
}

function completeWorkout() {
    if (workoutTimer) clearInterval(workoutTimer);
    
    // Collect all set data
    state.activeWorkout.exercises.forEach(exercise => {
        const trackers = document.querySelectorAll(`[data-exercise="${exercise.id}"]`);
        exercise.sets = Array.from(trackers).map(tracker => {
            const weight = tracker.querySelector('[data-field="weight"]').value;
            const reps = tracker.querySelector('[data-field="reps"]').value;
            const rpe = tracker.querySelector('[data-field="rpe"]').value;
            
            return {
                weight: weight ? parseFloat(weight) : 0,
                reps: reps ? parseInt(reps) : 0,
                rpe: rpe ? parseInt(rpe) : 0
            };
        }).filter(set => set.reps > 0); // Only include completed sets
    });
    
    state.activeWorkout.completed = true;
    state.activeWorkout.endTime = new Date().toISOString();
    
    // Save to history
    state.userData.workoutHistory.push(state.activeWorkout);
    state.activeWorkout = null;
    saveData();
    
    // Mark workout habit as complete
    const workoutHabit = state.userData.habits.find(h => h.id === 'workout');
    if (workoutHabit) {
        workoutHabit.completed = true;
        saveData();
    }
    
    // Show success and return to today view
    showNotification('🎉 Workout completed! Great work!', 'success');
    switchView('today');
}

function cancelWorkout() {
    if (confirm('Are you sure you want to cancel this workout?')) {
        if (workoutTimer) clearInterval(workoutTimer);
        state.activeWorkout = null;
        switchView('today');
    }
}

// Global functions for onclick handlers
window.toggleExerciseSelection = toggleExerciseSelection;
window.beginWorkout = beginWorkout;
window.addSet = addSet;
window.completeWorkout = completeWorkout;
window.cancelWorkout = cancelWorkout;

// ============================================================================
// PROGRESS VIEW
// ============================================================================

function renderProgressView() {
    renderStrengthProgress();
}

function renderStrengthProgress() {
    const container = document.getElementById('strength-stats');
    const workouts = state.userData.workoutHistory;
    
    if (workouts.length === 0) {
        document.getElementById('strength-charts').innerHTML = `
            <div class="chart-placeholder">
                <p>Complete workouts to see your strength progress</p>
            </div>
        `;
        return;
    }
    
    // Calculate stats
    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) => 
        sum + w.exercises.reduce((s, e) => s + e.sets.length, 0), 0);
    const avgRPE = workouts.reduce((sum, w) => 
        sum + w.exercises.reduce((s, e) => 
            s + e.sets.reduce((r, set) => r + set.rpe, 0) / e.sets.length, 0) / w.exercises.length, 0) / workouts.length;
    
    container.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">Total Workouts</div>
            <div class="stat-value">${totalWorkouts}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Total Sets</div>
            <div class="stat-value">${totalSets}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Avg RPE</div>
            <div class="stat-value">${avgRPE.toFixed(1)}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Current Streak</div>
            <div class="stat-value">${calculateWorkoutStreak()}</div>
        </div>
    `;
}

function calculateWorkoutStreak() {
    const workouts = state.userData.workoutHistory
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const workout of workouts) {
        const workoutDate = new Date(workout.date);
        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
            streak++;
            currentDate = workoutDate;
        } else {
            break;
        }
    }
    
    return streak;
}

function renderHealthProgress() {
    const container = document.getElementById('health-charts');
    const metrics = state.userData.healthMetrics;
    
    if (metrics.length === 0) {
        container.innerHTML = `
            <div class="chart-placeholder">
                <p>Log health metrics to see trends over time</p>
            </div>
        `;
        return;
    }
    
    // Simple text-based progress for now
    const recent = metrics.slice(-10).reverse();
    container.innerHTML = `
        <div class="metrics-history">
            ${recent.map(m => `
                <div class="metric-entry">
                    <div class="metric-date">${new Date(m.date).toLocaleDateString()}</div>
                    <div class="metric-values">
                        ${m.bloodPressure ? `BP: ${m.bloodPressure.systolic}/${m.bloodPressure.diastolic}` : ''}
                        ${m.weight ? `Weight: ${m.weight} lbs` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderBehaviorProgress() {
    const container = document.getElementById('behavior-stats');
    
    const smokeFreeStreak = calculateStreakDays('smokeFree');
    const alcoholFreeStreak = calculateStreakDays('alcoholFree');
    const workoutStreak = calculateWorkoutStreak();
    const habitCompletion = calculateHabitCompletion();
    
    container.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">Smoke-Free Days</div>
            <div class="stat-value">${smokeFreeStreak}</div>
            <div class="stat-change positive">+${smokeFreeStreak} day streak</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Alcohol-Free Days</div>
            <div class="stat-value">${alcoholFreeStreak}</div>
            <div class="stat-change positive">+${alcoholFreeStreak} day streak</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Workout Streak</div>
            <div class="stat-value">${workoutStreak}</div>
            <div class="stat-change positive">Consistent!</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Habit Completion</div>
            <div class="stat-value">${habitCompletion}%</div>
        </div>
    `;
}

function calculateHabitCompletion() {
    const completed = state.userData.habits.filter(h => h.completed).length;
    const total = state.userData.habits.length;
    return Math.round((completed / total) * 100);
}

// ============================================================================
// HEALTH VIEW
// ============================================================================

function renderHealthView() {
    const container = document.getElementById('health-entries-list');
    const entries = state.userData.healthMetrics.slice(-30).reverse();
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <p>No health entries yet</p>
                <p class="text-secondary">Track your blood pressure, weight, and compliance</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = entries.map(entry => `
        <div class="health-entry-card">
            <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            })}</div>
            <div class="entry-metrics">
                ${entry.bloodPressure ? `
                    <div class="entry-metric">
                        <span class="metric-icon">🩺</span>
                        <span>${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic} mmHg</span>
                    </div>
                ` : ''}
                ${entry.weight ? `
                    <div class="entry-metric">
                        <span class="metric-icon">⚖️</span>
                        <span>${entry.weight} lbs</span>
                    </div>
                ` : ''}
                <div class="entry-badges">
                    ${entry.smokeFree ? '<span class="badge success">🚭 Smoke-Free</span>' : ''}
                    ${entry.alcoholFree ? '<span class="badge success">🍺 Alcohol-Free</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openHealthMetricsModal() {
    const today = new Date().toISOString().split('T')[0];
    const existing = state.userData.healthMetrics.find(m => m.date === today);
    
    const modalContent = `
        <div class="modal-header">
            <h2>Log Health Metrics</h2>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <form id="health-metrics-form">
                <div class="settings-group">
                    <label>Blood Pressure</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="number" id="bp-systolic" class="input-field" placeholder="Systolic" 
                            value="${existing?.bloodPressure?.systolic || ''}">
                        <span style="align-self: center;">/</span>
                        <input type="number" id="bp-diastolic" class="input-field" placeholder="Diastolic"
                            value="${existing?.bloodPressure?.diastolic || ''}">
                    </div>
                </div>
                
                <div class="settings-group">
                    <label>Body Weight (lbs)</label>
                    <input type="number" id="weight-input" class="input-field" 
                        value="${existing?.weight || ''}">
                </div>
                
                <div class="settings-group">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="smoke-free-check" ${existing?.smokeFree ? 'checked' : ''}>
                        Smoke-Free Day
                    </label>
                </div>
                
                <div class="settings-group">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="alcohol-free-check" ${existing?.alcoholFree ? 'checked' : ''}>
                        Alcohol-Free Day
                    </label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-primary" onclick="saveHealthMetrics()">Save</button>
        </div>
    `;
    
    showModal(modalContent);
}

function saveHealthMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const systolic = document.getElementById('bp-systolic').value;
    const diastolic = document.getElementById('bp-diastolic').value;
    const weight = document.getElementById('weight-input').value;
    const smokeFree = document.getElementById('smoke-free-check').checked;
    const alcoholFree = document.getElementById('alcohol-free-check').checked;
    
    // Remove existing entry for today if it exists
    state.userData.healthMetrics = state.userData.healthMetrics.filter(m => m.date !== today);
    
    // Add new entry
    const entry = {
        date: today,
        smokeFree,
        alcoholFree
    };
    
    if (systolic && diastolic) {
        entry.bloodPressure = {
            systolic: parseInt(systolic),
            diastolic: parseInt(diastolic)
        };
    }
    
    if (weight) {
        entry.weight = parseFloat(weight);
    }
    
    state.userData.healthMetrics.push(entry);
    saveData();
    
    // Update relevant habits
    if (smokeFree) {
        const habit = state.userData.habits.find(h => h.id === 'no-smoking');
        if (habit) habit.completed = true;
    }
    if (alcoholFree) {
        const habit = state.userData.habits.find(h => h.id === 'no-alcohol');
        if (habit) habit.completed = true;
    }
    
    closeModal();
    renderTodayMetrics();
    renderHealthView();
    showNotification('Health metrics saved!', 'success');
}

// Global function for onclick
window.saveHealthMetrics = saveHealthMetrics;

// ============================================================================
// SETTINGS VIEW
// ============================================================================

function renderSettingsView() {
    document.getElementById('start-date-input').value = state.startDate || '';
    document.getElementById('current-week-input').value = state.currentWeek || 1;
    document.getElementById('partner-email-input').value = state.userData.partnerEmail || '';
}

function saveSettings() {
    state.startDate = document.getElementById('start-date-input').value;
    state.currentWeek = parseInt(document.getElementById('current-week-input').value) || 1;
    state.userData.partnerEmail = document.getElementById('partner-email-input').value;
    
    saveData();
    calculateCurrentPhase();
    renderTodayView();
    showNotification('Settings saved successfully!', 'success');
}

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================

function showModal(content) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-content');
    container.innerHTML = content;
    overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
}

function openWorkoutSelectionModal() {
    const modalContent = `
        <div class="modal-header">
            <h2>Select Workout</h2>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <p>Choose from your program workouts or create a custom workout</p>
            <div class="workout-options">
                <button class="btn-primary" style="width: 100%; margin-bottom: 12px;" onclick="startWorkout(); closeModal();">
                    Today's Scheduled Workout
                </button>
                <button class="btn-secondary" style="width: 100%;" onclick="closeModal()">
                    Custom Workout (Coming Soon)
                </button>
            </div>
        </div>
    `;
    showModal(modalContent);
}

// Global function for onclick
window.closeModal = closeModal;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--bg-secondary)'};
        color: white;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .health-entry-card {
        background: var(--bg-tertiary);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 12px;
    }
    .entry-date {
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-secondary);
    }
    .entry-metrics {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .entry-metric {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .entry-badges {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }
    .badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    .badge.success {
        background: rgba(76, 175, 80, 0.2);
        color: var(--success-color);
    }
    .text-secondary {
        color: var(--text-secondary);
        font-size: 14px;
    }
    .workout-preview-content h3 {
        margin-bottom: 8px;
    }
    .workout-description {
        color: var(--text-secondary);
        margin-bottom: 16px;
    }
    .workout-stats {
        display: flex;
        gap: 24px;
    }
    .workout-stat {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .workout-section {
        margin-bottom: 24px;
    }
    .workout-section h3 {
        margin-bottom: 12px;
    }
    .exercise-section {
        background: var(--bg-tertiary);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
    }
    .sets-container {
        margin: 12px 0;
    }
    .workout-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }
    .workout-actions button {
        flex: 1;
    }
`;
document.head.appendChild(style);

console.log('Longevity Protocol Tracker initialized successfully');
