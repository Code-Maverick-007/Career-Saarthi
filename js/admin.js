// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('open');
        mobileMenuOverlay.classList.toggle('hidden');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    }

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMobileMenu);
    if (closeMenuButton) closeMenuButton.addEventListener('click', toggleMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

    // Initialize charts
    initCharts();
    
    // Initialize data tables
    initDataTables();
    
    // Set up event listeners
    setupEventListeners();
});

// Initialize charts
function initCharts() {
    // Daily Active Users Chart
    const dailyUsersCtx = document.getElementById('daily-users-chart');
    if (dailyUsersCtx) {
        new Chart(dailyUsersCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [6500, 5900, 7200, 7500, 7800, 7000, 7200],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#0ea5e9',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value >= 1000 ? value/1000 + 'k' : value;
                            }
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

    // User Engagement Chart
    const engagementCtx = document.getElementById('engagement-chart');
    if (engagementCtx) {
        new Chart(engagementCtx, {
            type: 'doughnut',
            data: {
                labels: ['Students', 'Counselors', 'Admins'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#0ea5e9',
                        '#3b82f6',
                        '#60a5fa'
                    ],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize data tables
function initDataTables() {
    // Recent Activities Table
    const recentActivities = [
        { user: 'John Doe', action: 'Logged in', time: '2 min ago', status: 'success' },
        { user: 'Jane Smith', action: 'Updated profile', time: '10 min ago', status: 'info' },
        { user: 'Admin', action: 'Added new college', time: '25 min ago', status: 'info' },
        { user: 'Mike Johnson', action: 'Completed assessment', time: '1 hour ago', status: 'success' },
        { user: 'Sarah Wilson', action: 'Registered', time: '2 hours ago', status: 'success' }
    ];

    const activitiesTable = document.getElementById('recent-activities');
    if (activitiesTable) {
        const tbody = activitiesTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = recentActivities.map(activity => `
                <tr class="border-b border-gray-100 last:border-0">
                    <td class="py-3 px-4">
                        <div class="flex items-center">
                            <div class="w-2 h-2 rounded-full bg-${activity.status === 'success' ? 'green' : 'blue'}-500 mr-2"></div>
                            <span>${activity.user}</span>
                        </div>
                    </td>
                    <td class="py-3 px-4 text-gray-600">${activity.action}</td>
                    <td class="py-3 px-4 text-gray-400 text-sm">${activity.time}</td>
                </tr>
            `).join('');
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Toggle dark mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }

    // Check for saved user preference for dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }

    // Handle dropdown menus
    const dropdownButtons = document.querySelectorAll('[data-dropdown-toggle]');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dropdownId = this.getAttribute('data-dropdown-toggle');
            const dropdownMenu = document.getElementById(dropdownId);
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('hidden');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('[data-dropdown-toggle]')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (!dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                }
            });
        }
    });
}

// Add loading state to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button[data-loading]')) {
        const button = e.target;
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;
        
        // Simulate loading (remove in production)
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
        }, 1500);
    }
});

// Make functions available globally
window.toggleDropdown = function(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-tooltip]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
