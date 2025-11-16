// Longevity Protocol Tracker - Enhanced Version with Complete Workout Data
// Version 1.1.0

const APP_VERSION = '1.1.0';
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

// Complete Exercise Database
const EXERCISES = {
    // Lower Body - SAFE for Scoliosis
    'goblet-squat': { 
        name: 'Goblet Squat', 
        category: 'lower', 
        equipment: 'Dumbbell',
        safe: true,
        instructions: '3 sets x 12-15 reps. Hold dumbbell at chest, squat keeping chest up. Exhale on way up.',
        video: 'https://www.youtube.com/watch?v=rVwJlgO_TWY'
    },
    'split-squat': { 
        name: 'Split Squats', 
        category: 'lower', 
        equipment: 'Dumbbells',
        safe: true,
        instructions: '3 sets x 10 reps per leg. Dumbbells at sides, rear foot elevated optional.',
        video: ''
    },
    'db-rdl': { 
        name: 'Dumbbell Romanian Deadlift', 
        category: 'lower', 
        equipment: 'Dumbbells',
        safe: true,
        instructions: '3 sets x 10 reps. Hinge at hips, keep back neutral. Feel hamstring stretch.',
        video: ''
    },
    'leg-press': { 
        name: 'Leg Press', 
        category: 'lower', 
        equipment: 'Machine',
        safe: true,
        instructions: '3-4 sets x 8-12 reps. Feet shoulder-width, full range of motion.',
        video: ''
    },
    'glute-bridge': { 
        name: 'Glute Bridge', 
        category: 'lower', 
        equipment: 'Bodyweight/Band',
        safe: true,
        instructions: '3 sets x 12 reps. Squeeze glutes at top, hold 2 seconds.',
        video: ''
    },
    'side-leg-raise': { 
        name: 'Side Leg Raises', 
        category: 'lower', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x 10 per side. Slow and controlled, maintain balance.',
        video: ''
    },
    
    // Upper Body Push - SAFE
    'db-chest-press': { 
        name: 'Dumbbell Chest Press (Flat)', 
        category: 'push', 
        equipment: 'Dumbbells + Bench',
        safe: true,
        instructions: '3-4 sets x 8-12 reps. Independent arm movement, exhale on press.',
        video: 'https://www.youtube.com/watch?v=pKZMNVbfUzQ'
    },
    'db-incline-press': { 
        name: 'Dumbbell Incline Press', 
        category: 'push', 
        equipment: 'Dumbbells + Bench',
        safe: true,
        instructions: '3-4 sets x 10 reps. 30-45 degree incline, focus on upper chest.',
        video: ''
    },
    'pushups': { 
        name: 'Push-ups', 
        category: 'push', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: 'To failure. Keep core braced, exhale on push up.',
        video: ''
    },
    'pushups-modified': { 
        name: 'Modified Push-ups (Incline)', 
        category: 'push', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x failure. Hands on bench or bar, easier than floor.',
        video: ''
    },
    
    // Upper Body Pull - SAFE
    'single-arm-row': { 
        name: 'Single-Arm Dumbbell Row', 
        category: 'pull', 
        equipment: 'Dumbbell',
        safe: true,
        instructions: '3 sets x 10-12 per arm. Both feet planted, no spinal rotation.',
        video: 'https://www.youtube.com/watch?v=TYmOeShOIpA'
    },
    'cable-row': { 
        name: 'Seated Cable Row', 
        category: 'pull', 
        equipment: 'Cable Machine',
        safe: true,
        instructions: '3-4 sets x 10 reps. Pull to sternum, squeeze shoulder blades.',
        video: ''
    },
    'lat-pulldown': { 
        name: 'Lat Pulldown', 
        category: 'pull', 
        equipment: 'Cable Machine',
        safe: true,
        instructions: '3-4 sets x 10-12 reps. Wide or medium grip, pull to upper chest.',
        video: ''
    },
    'pullups-assisted': { 
        name: 'Pull-ups (Assisted)', 
        category: 'pull', 
        equipment: 'Assisted Machine',
        safe: true,
        instructions: 'To failure or 8+ reps. Use assistance as needed.',
        video: ''
    },
    
    // Shoulders - SAFE
    'db-shoulder-press': { 
        name: 'Seated Dumbbell Shoulder Press', 
        category: 'shoulders', 
        equipment: 'Dumbbells + Bench',
        safe: true,
        instructions: '3 sets x 6-10 reps. Seated with back support, controlled breathing.',
        video: 'https://www.youtube.com/watch?v=gfUg6qWohTk'
    },
    'lateral-raise': { 
        name: 'Dumbbell Lateral Raise', 
        category: 'shoulders', 
        equipment: 'Dumbbells',
        safe: true,
        instructions: '3 sets x 12 reps. Raise to shoulder height, control descent.',
        video: ''
    },
    
    // Core & Stability - SAFE
    'pallof-press': { 
        name: 'Pallof Press', 
        category: 'core', 
        equipment: 'Cable/Band',
        safe: true,
        instructions: '3 sets x 12 per side. Anti-rotation hold, crucial for scoliosis.',
        video: 'https://www.youtube.com/watch?v=cwL4V7ilbAs'
    },
    'side-plank': { 
        name: 'Side Plank', 
        category: 'core', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x 30-45 sec per side. Maintain straight line.',
        video: ''
    },
    'ab-cylinder': { 
        name: 'Abdominal Cylinder Exercise', 
        category: 'core', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x 10 breaths. Deep core activation, internal pressure.',
        video: 'https://www.youtube.com/watch?v=9wYUawp_lSg'
    },
    'pelvic-tilt': { 
        name: 'Pelvic Tilts', 
        category: 'core', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x 12 reps. Improves proprioception and spinal mobility.',
        video: ''
    },
    
    // Mobility & Warm-up
    'cat-cow': { 
        name: 'Cat/Cow Pose', 
        category: 'mobility', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '3 sets x 10 reps. Gentle spine mobility, check for even movement.',
        video: ''
    },
    'rotational-breathing': { 
        name: 'Rotational Angular Breathing', 
        category: 'mobility', 
        equipment: 'Bodyweight',
        safe: true,
        instructions: '5 minutes. Crucial for lung performance and spinal alignment.',
        video: ''
    },
    
    // Arms
    'ez-curl': { 
        name: 'EZ Bar Curl', 
        category: 'arms', 
        equipment: 'EZ Bar',
        safe: true,
        instructions: '2-3 sets x 8-12 reps. Controlled movement, no swinging.',
        video: ''
    },
    'db-curl': { 
        name: 'Dumbbell Curl', 
        category: 'arms', 
        equipment: 'Dumbbells',
        safe: true,
        instructions: '2-3 sets x 10-12 reps. Can alternate or do together.',
        video: ''
    },
    'tricep-pressdown': { 
        name: 'Rope Press-downs', 
        category: 'arms', 
        equipment: 'Cable',
        safe: true,
        instructions: '2-3 sets x 10-12 reps. Keep elbows at sides.',
        video: ''
    },
    'db-skullcrusher': { 
        name: 'Dumbbell Skull Crushers', 
        category: 'arms', 
        equipment: 'Dumbbells',
        safe: true,
        instructions: '2-3 sets x 10 reps. Lower behind head, control the weight.',
        video: ''
    }
};

// Pre-built Workout Programs
const WORKOUT_PROGRAMS = {
    foundation_a: {
        name: 'Foundation Day A',
        phase: 'FOUNDATION',
        exercises: [
            { id: 'rotational-breathing', sets: 1, reps: '5 min', rpe: 3 },
            { id: 'cat-cow', sets: 3, reps: 10, rpe: 3 },
            { id: 'ab-cylinder', sets: 3, reps: 10, rpe: 4 },
            { id: 'pelvic-tilt', sets: 3, reps: 12, rpe: 3 },
            { id: 'goblet-squat', sets: 3, reps: 15, rpe: 5 },
            { id: 'pushups-modified', sets: 3, reps: 'failure', rpe: 5 },
            { id: 'single-arm-row', sets: 3, reps: 12, rpe: 5 },
            { id: 'side-leg-raise', sets: 3, reps: 10, rpe: 4 }
        ]
    },
    strength_lower: {
        name: 'Strength - Lower Body',
        phase: 'STRENGTH',
        exercises: [
            { id: 'goblet-squat', sets: 4, reps: 10, rpe: 7 },
            { id: 'db-rdl', sets: 3, reps: 10, rpe: 7 },
            { id: 'split-squat', sets: 3, reps: 10, rpe: 7 },
            { id: 'glute-bridge', sets: 3, reps: 12, rpe: 6 }
        ]
    },
    strength_upper: {
        name: 'Strength - Upper Body',
        phase: 'STRENGTH',
        exercises: [
            { id: 'db-chest-press', sets: 4, reps: 10, rpe: 7 },
            { id: 'single-arm-row', sets: 3, reps: 10, rpe: 7 },
            { id: 'db-shoulder-press', sets: 3, reps: 10, rpe: 7 },
            { id: 'pallof-press', sets: 3, reps: 12, rpe: 6 }
        ]
    },
    hypertrophy_heavy: {
        name: 'Hypertrophy - Heavy (A)',
        phase: 'HYPERTROPHY',
        exercises: [
            { id: 'goblet-squat', sets: 3, reps: '6-8', rpe: 8 },
            { id: 'db-chest-press', sets: 3, reps: '8-10', rpe: 8 },
            { id: 'single-arm-row', sets: 3, reps: '8-10', rpe: 8 },
            { id: 'db-shoulder-press', sets: 3, reps: '6-10', rpe: 8 },
            { id: 'ez-curl', sets: 2, reps: '8-10', rpe: 7 },
            { id: 'tricep-pressdown', sets: 2, reps: '8-10', rpe: 7 }
        ]
    },
    hypertrophy_light: {
        name: 'Hypertrophy - Light (B)',
        phase: 'HYPERTROPHY',
        exercises: [
            { id: 'leg-press', sets: 3, reps: '15-20', rpe: 7 },
            { id: 'db-incline-press', sets: 3, reps: '12-15', rpe: 7 },
            { id: 'lat-pulldown', sets: 3, reps: '12-15', rpe: 7 },
            { id: 'lateral-raise', sets: 3, reps: '12-15', rpe: 6 },
            { id: 'db-curl', sets: 2, reps: '10-12', rpe: 7 },
            { id: 'db-skullcrusher', sets: 2, reps: '10-12', rpe: 7 }
        ]
    },
    hypertrophy_moderate: {
        name: 'Hypertrophy - Moderate (C)',
        phase: 'HYPERTROPHY',
        exercises: [
            { id: 'split-squat', sets: 3, reps: '8-10', rpe: 7 },
            { id: 'db-chest-press', sets: 3, reps: '10-12', rpe: 7 },
            { id: 'cable-row', sets: 3, reps: '10-12', rpe: 7 },
            { id: 'pushups', sets: 1, reps: 'failure', rpe: 8 },
            { id: 'pullups-assisted', sets: 1, reps: 'failure', rpe: 8 },
            { id: 'ez-curl', sets: 2, reps: '8-12', rpe: 7 },
            { id: 'tricep-pressdown', sets: 2, reps: '8-12', rpe: 7 }
        ]
    }
};

// Default habits
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
    
    loadData();
    setupEventListeners();
    updateCurrentDate();
    calculateCurrentPhase();
    renderTodayView();
    renderHabits();
    
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

            // Ensure all required data structures exist
            if (!state.userData) state.userData = {};
            if (!Array.isArray(state.userData.healthMetrics)) state.userData.healthMetrics = [];
            if (!Array.isArray(state.userData.workoutHistory)) state.userData.workoutHistory = [];
            if (!Array.isArray(state.userData.habits) || state.userData.habits.length === 0) {
                state.userData.habits = DEFAULT_HABITS.map(h => ({...h}));
            }
            if (!state.startDate) state.startDate = new Date().toISOString().split('T')[0];
            if (!state.currentWeek || state.currentWeek < 1) state.currentWeek = 1;

            console.log('Data loaded successfully');
        } else {
            initializeDefaultState();
            saveData();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        initializeDefaultState();
    }
}

function initializeDefaultState() {
    state.startDate = new Date().toISOString().split('T')[0];
    state.currentWeek = 1;
    state.userData = {
        profileEmail: '',
        partnerEmail: '',
        healthMetrics: [],
        workoutHistory: [],
        habits: DEFAULT_HABITS.map(h => ({...h}))
    };
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
    if (!file) {
        showNotification('No file selected', 'info');
        return;
    }

    if (!file.name.endsWith('.json')) {
        showNotification('Please select a valid JSON file', 'info');
        return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
        console.error('Error reading file');
        showNotification('Failed to read file', 'info');
    };

    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);

            // Validate the imported data structure
            if (typeof imported !== 'object' || imported === null) {
                throw new Error('Invalid data format');
            }

            // Merge the imported data with state
            Object.assign(state, imported);

            // Ensure critical data structures exist
            if (!state.userData) state.userData = {};
            if (!Array.isArray(state.userData.healthMetrics)) state.userData.healthMetrics = [];
            if (!Array.isArray(state.userData.workoutHistory)) state.userData.workoutHistory = [];
            if (!Array.isArray(state.userData.habits)) state.userData.habits = DEFAULT_HABITS.map(h => ({...h}));

            saveData();
            showNotification('Data imported successfully! Reloading...', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Failed to import data. Please check the file format.', 'info');
        }
    };

    reader.readAsText(file);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    document.getElementById('start-workout-btn')?.addEventListener('click', showWorkoutSelection);
    document.getElementById('log-metrics-btn')?.addEventListener('click', () => openHealthMetricsModal());
    document.getElementById('select-workout-btn')?.addEventListener('click', showWorkoutSelection);
    document.getElementById('browse-workouts-btn')?.addEventListener('click', showWorkoutSelection);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    document.getElementById('add-health-entry-btn')?.addEventListener('click', () => openHealthMetricsModal());
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
    
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            closeModal();
        }
    });
}

// ============================================================================
// NAVIGATION
// ============================================================================

function switchView(viewName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    
    document.querySelectorAll('.view').forEach(view => {
        view.classList.toggle('active', view.id === `${viewName}-view`);
    });
    
    state.currentView = viewName;
    
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
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
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

    const phaseNameElement = document.getElementById('current-phase-name');
    const currentWeekElement = document.getElementById('current-week');
    const progressFillElement = document.getElementById('phase-progress-fill');
    const progressPercentElement = document.getElementById('phase-progress-percent');

    if (phaseNameElement) phaseNameElement.textContent = phase.name;
    if (currentWeekElement) currentWeekElement.textContent = state.currentWeek;
    if (progressFillElement) progressFillElement.style.width = weekProgress + '%';
    if (progressPercentElement) progressPercentElement.textContent = Math.round(weekProgress);
}

function renderTodayWorkout() {
    const container = document.getElementById('today-workout-content');
    const today = new Date().getDay();
    
    const phase = calculateCurrentPhase();
    let isWorkoutDay = false;
    let workoutType = '';
    
    if (state.currentPhase === 'FOUNDATION') {
        isWorkoutDay = [1, 3, 5].includes(today);
        workoutType = 'Full Body';
    } else if (state.currentPhase === 'STRENGTH') {
        isWorkoutDay = [1, 2, 4, 5].includes(today);
        workoutType = today === 1 || today === 4 ? 'Lower Body' : 'Upper Body';
    } else if (state.currentPhase === 'HYPERTROPHY') {
        isWorkoutDay = [1, 3, 5].includes(today);
        const dayIndex = [1, 3, 5].indexOf(today);
        workoutType = ['Heavy', 'Light', 'Moderate'][dayIndex] + ' Full Body';
    } else if (state.currentPhase === 'INTEGRATION') {
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
    const today = new Date().toISOString().split('T')[0];
    const todayMetrics = state.userData.healthMetrics.find(m => m.date === today);

    if (todayMetrics) {
        if (todayMetrics.bloodPressure && todayMetrics.bloodPressure.systolic && todayMetrics.bloodPressure.diastolic) {
            const bpElement = document.getElementById('bp-value');
            if (bpElement) {
                bpElement.textContent =
                    `${todayMetrics.bloodPressure.systolic}/${todayMetrics.bloodPressure.diastolic}`;
            }
        }
        if (todayMetrics.weight) {
            const weightElement = document.getElementById('weight-value');
            if (weightElement) {
                weightElement.textContent = `${todayMetrics.weight} lbs`;
            }
        }
    }

    const smokeFree = calculateStreakDays('smokeFree');
    const alcoholFree = calculateStreakDays('alcoholFree');

    const smokeFreeElement = document.getElementById('smoke-free-days');
    const alcoholFreeElement = document.getElementById('alcohol-free-days');

    if (smokeFreeElement) smokeFreeElement.textContent = smokeFree;
    if (alcoholFreeElement) alcoholFreeElement.textContent = alcoholFree;
}

function calculateStreakDays(type) {
    if (!state.userData.healthMetrics || state.userData.healthMetrics.length === 0) {
        return 0;
    }

    const metrics = [...state.userData.healthMetrics]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    for (const metric of metrics) {
        if (metric && metric[type] === true) {
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
        
        if (habit.completed) {
            showNotification(`✓ ${habit.name}`, 'success');
        }
    }
}

// ============================================================================
// WORKOUT SELECTION & TRACKING
// ============================================================================

function showWorkoutSelection() {
    const phase = state.currentPhase;
    let programs = [];
    
    if (phase === 'FOUNDATION') {
        programs = [WORKOUT_PROGRAMS.foundation_a];
    } else if (phase === 'STRENGTH') {
        programs = [WORKOUT_PROGRAMS.strength_lower, WORKOUT_PROGRAMS.strength_upper];
    } else if (phase === 'HYPERTROPHY') {
        programs = [
            WORKOUT_PROGRAMS.hypertrophy_heavy,
            WORKOUT_PROGRAMS.hypertrophy_light,
            WORKOUT_PROGRAMS.hypertrophy_moderate
        ];
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Select Today's Workout</h2>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <div class="modal-body">
            <p>Choose a pre-built workout for your current phase:</p>
            <div class="workout-programs">
                ${programs.map(program => `
                    <div class="program-card" onclick="startProgramWorkout('${Object.keys(WORKOUT_PROGRAMS).find(key => WORKOUT_PROGRAMS[key] === program)}')">
                        <h3>${program.name}</h3>
                        <p>${program.exercises.length} exercises</p>
                        <p class="program-meta">Tap to start</p>
                    </div>
                `).join('')}
                <div class="program-card" onclick="buildCustomWorkout()">
                    <h3>Custom Workout</h3>
                    <p>Build your own</p>
                    <p class="program-meta">Select exercises</p>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function startProgramWorkout(programKey) {
    const program = WORKOUT_PROGRAMS[programKey];
    
    state.activeWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        phase: state.currentPhase,
        week: state.currentWeek,
        programName: program.name,
        exercises: program.exercises.map(ex => ({
            id: ex.id,
            name: EXERCISES[ex.id].name,
            targetSets: ex.sets,
            targetReps: ex.reps,
            targetRPE: ex.rpe,
            sets: []
        })),
        completed: false,
        startTime: new Date().toISOString()
    };
    
    closeModal();
    switchView('workout');
    renderActiveWorkout();
}

function buildCustomWorkout() {
    closeModal();
    const container = document.getElementById('workout-content');
    
    const safeExercises = Object.entries(EXERCISES).filter(([id, ex]) => ex.safe);
    
    container.innerHTML = `
        <div class="workout-builder">
            <div class="workout-header">
                <h2>Build Custom Workout</h2>
                <p>Select exercises (tap to add/remove)</p>
            </div>
            
            <div class="exercise-selection">
                ${safeExercises.map(([id, ex]) => `
                    <div class="exercise-item" data-exercise-id="${id}" onclick="toggleExerciseSelection('${id}')">
                        <div class="exercise-name">${ex.name}</div>
                        <div class="exercise-meta">
                            <span class="exercise-tag safe">✓ Safe</span>
                            <span>${ex.category}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="workout-actions">
                <button class="btn-secondary" onclick="switchView('today')">Cancel</button>
                <button class="btn-primary" onclick="beginCustomWorkout()">Begin Workout</button>
            </div>
        </div>
    `;
}

function toggleExerciseSelection(exerciseId) {
    const item = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
    if (item) {
        item.classList.toggle('selected');
    }
}

function beginCustomWorkout() {
    const selected = Array.from(document.querySelectorAll('.exercise-item.selected'))
        .map(item => item.dataset.exerciseId)
        .filter(id => id && EXERCISES[id]);

    if (selected.length === 0) {
        showNotification('Please select at least one exercise', 'info');
        return;
    }
    
    state.activeWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        phase: state.currentPhase,
        week: state.currentWeek,
        programName: 'Custom Workout',
        exercises: selected.map(id => ({
            id: id,
            name: EXERCISES[id].name,
            targetSets: 3,
            targetReps: '10-12',
            targetRPE: 7,
            sets: []
        })),
        completed: false,
        startTime: new Date().toISOString()
    };
    
    renderActiveWorkout();
}

function renderActiveWorkout() {
    const container = document.getElementById('workout-content');
    const workout = state.activeWorkout;
    
    container.innerHTML = `
        <div class="active-workout">
            <div class="workout-summary">
                <h2>${workout.programName}</h2>
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
    
    startWorkoutTimer();
}

function renderExerciseTracker(exercise, index) {
    const exerciseData = EXERCISES[exercise.id];
    if (!exerciseData) {
        console.error(`Exercise ${exercise.id} not found in EXERCISES database`);
        return '<div class="exercise-section"><p>Exercise data not found</p></div>';
    }
    const numSets = exercise.targetSets || 3;
    
    return `
        <div class="exercise-section">
            <h3>${exercise.name}</h3>
            <p class="exercise-instructions">${exerciseData.instructions}</p>
            <p class="exercise-target">Target: ${numSets} sets × ${exercise.targetReps} reps @ RPE ${exercise.targetRPE}</p>
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
        const elem = document.getElementById('workout-duration');
        if (elem) {
            elem.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function addSet(exerciseId) {
    if (!exerciseId) return;

    const exerciseElement = document.querySelector(`[data-exercise="${exerciseId}"]`);
    if (!exerciseElement) {
        console.error(`Exercise element for ${exerciseId} not found`);
        return;
    }

    const exerciseSection = exerciseElement.closest('.exercise-section');
    if (!exerciseSection) {
        console.error(`Exercise section for ${exerciseId} not found`);
        return;
    }

    const container = exerciseSection.querySelector('.sets-container');
    if (!container) {
        console.error(`Sets container for ${exerciseId} not found`);
        return;
    }

    const setNumber = container.querySelectorAll('.set-tracker').length + 1;
    const newSet = renderSetTracker(exerciseId, setNumber);
    container.insertAdjacentHTML('beforeend', newSet);
}

function completeWorkout() {
    if (workoutTimer) clearInterval(workoutTimer);

    if (!state.activeWorkout) {
        showNotification('No active workout found', 'info');
        return;
    }

    state.activeWorkout.exercises.forEach(exercise => {
        const trackers = document.querySelectorAll(`[data-exercise="${exercise.id}"]`);
        exercise.sets = Array.from(trackers).map(tracker => {
            const weightInput = tracker.querySelector('[data-field="weight"]');
            const repsInput = tracker.querySelector('[data-field="reps"]');
            const rpeInput = tracker.querySelector('[data-field="rpe"]');

            return {
                weight: weightInput && weightInput.value ? parseFloat(weightInput.value) : 0,
                reps: repsInput && repsInput.value ? parseInt(repsInput.value) : 0,
                rpe: rpeInput && rpeInput.value ? parseInt(rpeInput.value) : 0
            };
        }).filter(set => set.reps > 0);
    });
    
    state.activeWorkout.completed = true;
    state.activeWorkout.endTime = new Date().toISOString();
    
    state.userData.workoutHistory.push(state.activeWorkout);
    state.activeWorkout = null;
    saveData();
    
    const workoutHabit = state.userData.habits.find(h => h.id === 'workout');
    if (workoutHabit) {
        workoutHabit.completed = true;
        saveData();
    }
    
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

window.toggleExerciseSelection = toggleExerciseSelection;
window.beginCustomWorkout = beginCustomWorkout;
window.startProgramWorkout = startProgramWorkout;
window.buildCustomWorkout = buildCustomWorkout;
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
    const chartsContainer = document.getElementById('strength-charts');

    if (!container) return;

    const workouts = state.userData.workoutHistory || [];

    if (workouts.length === 0) {
        if (chartsContainer) {
            chartsContainer.innerHTML = `
                <div class="chart-placeholder">
                    <p>Complete workouts to see your strength progress</p>
                </div>
            `;
        }
        container.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Total Workouts</div>
                <div class="stat-value">0</div>
            </div>
        `;
        return;
    }

    const totalWorkouts = workouts.length;
    const totalSets = workouts.reduce((sum, w) =>
        sum + (w.exercises ? w.exercises.reduce((s, e) => s + (e.sets ? e.sets.length : 0), 0) : 0), 0);
    const avgRPE = workouts.reduce((sum, w) => {
        if (!w.exercises || w.exercises.length === 0) return sum;
        const workoutAvg = w.exercises.reduce((s, e) => {
            if (!e.sets || e.sets.length === 0) return s;
            const exerciseAvg = e.sets.reduce((r, set) => r + (set.rpe || 0), 0) / e.sets.length;
            return s + exerciseAvg;
        }, 0) / w.exercises.length;
        return sum + workoutAvg;
    }, 0) / workouts.length;
    
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
    if (!state.userData.workoutHistory || state.userData.workoutHistory.length === 0) {
        return 0;
    }

    const workouts = [...state.userData.workoutHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

    for (const workout of workouts) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0); // Normalize to start of day

        const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 2) { // Allow for rest days
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
    if (!container) return;

    const metrics = state.userData.healthMetrics || [];

    if (metrics.length === 0) {
        container.innerHTML = `
            <div class="chart-placeholder">
                <p>Log health metrics to see trends over time</p>
            </div>
        `;
        return;
    }

    const recent = metrics.slice(-10).reverse();
    container.innerHTML = `
        <div class="metrics-history">
            ${recent.map(m => `
                <div class="metric-entry">
                    <div class="metric-date">${new Date(m.date).toLocaleDateString()}</div>
                    <div class="metric-values">
                        ${m.bloodPressure && m.bloodPressure.systolic && m.bloodPressure.diastolic ?
                            `BP: ${m.bloodPressure.systolic}/${m.bloodPressure.diastolic}` : ''}
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
    if (!state.userData.habits || state.userData.habits.length === 0) {
        return 0;
    }
    const completed = state.userData.habits.filter(h => h && h.completed).length;
    const total = state.userData.habits.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
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

    const systolicElement = document.getElementById('bp-systolic');
    const diastolicElement = document.getElementById('bp-diastolic');
    const weightElement = document.getElementById('weight-input');
    const smokeFreeElement = document.getElementById('smoke-free-check');
    const alcoholFreeElement = document.getElementById('alcohol-free-check');

    if (!systolicElement || !diastolicElement || !weightElement || !smokeFreeElement || !alcoholFreeElement) {
        console.error('Health metrics form elements not found');
        return;
    }

    const systolic = systolicElement.value;
    const diastolic = diastolicElement.value;
    const weight = weightElement.value;
    const smokeFree = smokeFreeElement.checked;
    const alcoholFree = alcoholFreeElement.checked;
    
    state.userData.healthMetrics = state.userData.healthMetrics.filter(m => m.date !== today);
    
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

window.saveHealthMetrics = saveHealthMetrics;

// ============================================================================
// SETTINGS VIEW
// ============================================================================

function renderSettingsView() {
    const startDateElement = document.getElementById('start-date-input');
    const currentWeekElement = document.getElementById('current-week-input');
    const partnerEmailElement = document.getElementById('partner-email-input');

    if (startDateElement) startDateElement.value = state.startDate || '';
    if (currentWeekElement) currentWeekElement.value = state.currentWeek || 1;
    if (partnerEmailElement) partnerEmailElement.value = state.userData.partnerEmail || '';
}

function saveSettings() {
    const startDateElement = document.getElementById('start-date-input');
    const currentWeekElement = document.getElementById('current-week-input');
    const partnerEmailElement = document.getElementById('partner-email-input');

    if (startDateElement) {
        state.startDate = startDateElement.value;
    }

    if (currentWeekElement) {
        const weekValue = parseInt(currentWeekElement.value);
        state.currentWeek = (weekValue >= 1 && weekValue <= 52) ? weekValue : 1;
    }

    if (partnerEmailElement) {
        state.userData.partnerEmail = partnerEmailElement.value;
    }

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

window.closeModal = closeModal;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'info') {
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
    .exercise-section {
        background: var(--bg-tertiary);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
    }
    .exercise-instructions {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 8px;
    }
    .exercise-target {
        font-size: 13px;
        color: var(--secondary-color);
        font-weight: 600;
        margin-bottom: 12px;
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
    .program-card {
        background: var(--bg-tertiary);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .program-card:active {
        transform: scale(0.98);
        background: var(--bg-primary);
    }
    .program-card h3 {
        margin-bottom: 8px;
    }
    .program-meta {
        color: var(--text-secondary);
        font-size: 13px;
        margin-top: 8px;
    }
    .workout-programs {
        display: flex;
        flex-direction: column;
    }
`;
document.head.appendChild(style);

console.log('Longevity Protocol Tracker v' + APP_VERSION + ' initialized successfully');
