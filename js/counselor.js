// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initAppointmentsChart();
    initStudentProgressChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboardData();
});

// Initialize appointments chart
function initAppointmentsChart() {
    const ctx = document.getElementById('appointmentsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Appointments',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        stepSize: 5
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize student progress chart
function initStudentProgressChart() {
    const ctx = document.getElementById('studentProgressChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Not Started'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#e5e7eb'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Toggle mobile menu
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#mobileMenu') && !event.target.closest('#mobileMenuButton')) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
    
    // Toggle dark mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }
    
    // Initialize tooltips
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        new bootstrap.Tooltip(trigger);
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Simulate API call
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        // Update UI with data
        updateDashboardUI(data);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to mock data
        const mockData = getMockDashboardData();
        updateDashboardUI(mockData);
    }
}

// Update UI with dashboard data
function updateDashboardUI(data) {
    // Update stats
    if (data.stats) {
        const stats = data.stats;
        
        // Update appointment stats
        const appointmentElement = document.querySelector('[data-stat="appointments"]');
        if (appointmentElement) {
            appointmentElement.textContent = stats.appointments || 0;
        }
        
        // Update student stats
        const studentsElement = document.querySelector('[data-stat="students"]');
        if (studentsElement) {
            studentsElement.textContent = stats.students || 0;
        }
        
        // Update rating
        const ratingElement = document.querySelector('[data-stat="rating"]');
        if (ratingElement) {
            ratingElement.textContent = stats.rating || '4.8';
        }
    }
    
    // Update recent activities
    if (data.activities && data.activities.length > 0) {
        const activitiesContainer = document.querySelector('#recentActivities');
        if (activitiesContainer) {
            activitiesContainer.innerHTML = data.activities.map(activity => `
                <div class="flex items-start py-3 border-b border-gray-100 last:border-0">
                    <div class="p-2 rounded-full ${getActivityColor(activity.type)}">
                        <span class="material-icons text-sm">${getActivityIcon(activity.type)}</span>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium">${activity.title}</p>
                        <p class="text-xs text-gray-500">${activity.time}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Get activity color based on type
function getActivityColor(type) {
    const colors = {
        'appointment': 'bg-blue-100 text-blue-600',
        'message': 'bg-green-100 text-green-600',
        'reminder': 'bg-amber-100 text-amber-600',
        'update': 'bg-purple-100 text-purple-600',
        'default': 'bg-gray-100 text-gray-600'
    };
    return colors[type] || colors.default;
}

// Get activity icon based on type
function getActivityIcon(type) {
    const icons = {
        'appointment': 'event',
        'message': 'chat',
        'reminder': 'notifications',
        'update': 'update',
        'default': 'info'
    };
    return icons[type] || icons.default;
}

// Mock data for dashboard
function getMockDashboardData() {
    return {
        stats: {
            appointments: 5,
            students: 24,
            rating: '4.8',
            pendingQueries: 8
        },
        activities: [
            {
                type: 'appointment',
                title: 'Session completed with Rahul Sharma',
                time: '2 hours ago'
            },
            {
                type: 'message',
                title: 'New message from Priya Patel',
                time: '4 hours ago'
            },
            {
                type: 'reminder',
                title: 'Follow up with Amit Kumar tomorrow',
                time: '1 day ago'
            },
            {
                type: 'update',
                title: 'New resources available in your library',
                time: '2 days ago'
            }
        ],
        upcomingAppointments: [
            {
                id: 1,
                student: 'Rahul Sharma',
                type: 'Career Guidance',
                time: '10:30 AM',
                date: 'Today',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            {
                id: 2,
                student: 'Priya Patel',
                type: 'College Selection',
                time: '2:00 PM',
                date: 'Today',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
                id: 3,
                student: 'Amit Kumar',
                type: 'Resume Review',
                time: '4:30 PM',
                date: 'Today',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
            }
        ]
    };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAppointmentsChart,
        initStudentProgressChart,
        getActivityColor,
        getActivityIcon,
        getMockDashboardData
    };
}
