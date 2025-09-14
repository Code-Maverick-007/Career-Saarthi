// Shared utilities and components for CareerSaarthi

// Current user state
let currentUser = null;

// User roles
const ROLES = {
    STUDENT: 'student',
    COUNSELOR: 'counselor',
    COLLEGE: 'college',
    ADMIN: 'admin'
};

// Route configuration
const ROUTES = {
    // Auth
    LOGIN: 'login.html',
    
    // Student
    STUDENT_HOME: 'student_home_screen.html',
    STUDENT_DASHBOARD: 'student_dashboard.html',
    STUDENT_AI_ADVISOR: 'student_ai_advisor.html',
    STUDENT_CAREER_EXPLORER: 'student_career_explorer.html',
    STUDENT_SCHOLARSHIPS: 'student_scholarships.html',
    
    // Counselor
    COUNSELOR_DASHBOARD: 'counselor_dashboard.html',
    COUNSELOR_APPOINTMENTS: 'counselor_appointments.html',
    COUNSELOR_MY_STUDENTS: 'counselor_my_students.html',
    
    // College
    COLLEGE_DASHBOARD: 'college_dashboard.html',
    COLLEGE_EVENTS: 'college_event_management.html',
    
    // Admin
    ADMIN_DASHBOARD: 'admin_dashboard.html',
    ADMIN_STUDENTS: 'admin_student_management.html',
    ADMIN_COUNSELORS: 'admin_counselor_management.html',
    ADMIN_COLLEGES: 'admin_college_management.html',
    ADMIN_SCHOLARSHIPS: 'admin_scholarship_management.html'
};

// Navigation functions
const Navigation = {
    // Navigate to a specific route
    navigateTo: (route) => {
        window.location.href = route;
    },
    
    // Get the current page
    getCurrentPage: () => {
        return window.location.pathname.split('/').pop();
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },
    
    // Get current user role
    getCurrentUserRole: () => {
        return localStorage.getItem('userRole');
    },
    
    // Redirect to login if not authenticated
    requireAuth: () => {
        if (!Navigation.isAuthenticated()) {
            Navigation.navigateTo(ROUTES.LOGIN);
            return false;
        }
        return true;
    },
    
    // Redirect based on user role
    redirectByRole: (role) => {
        switch(role) {
            case ROLES.STUDENT:
                Navigation.navigateTo(ROUTES.STUDENT_DASHBOARD);
                break;
            case ROLES.COUNSELOR:
                Navigation.navigateTo(ROUTES.COUNSELOR_DASHBOARD);
                break;
            case ROLES.COLLEGE:
                Navigation.navigateTo(ROUTES.COLLEGE_DASHBOARD);
                break;
            case ROLES.ADMIN:
                Navigation.navigateTo(ROUTES.ADMIN_DASHBOARD);
                break;
            default:
                Navigation.navigateTo(ROUTES.LOGIN);
        }
    },
    
    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        Navigation.navigateTo(ROUTES.LOGIN);
    }
};

// Initialize the application
const initApp = () => {
    // Check authentication on page load
    const currentPage = Navigation.getCurrentPage();
    const isLoginPage = currentPage === ROUTES.LOGIN;
    
    if (!isLoginPage && !Navigation.isAuthenticated()) {
        Navigation.navigateTo(ROUTES.LOGIN);
        return;
    }
    
    if (isLoginPage && Navigation.isAuthenticated()) {
        Navigation.redirectByRole(Navigation.getCurrentUserRole());
    }
    
    // Initialize navigation events
    initNavigation();
};

// Initialize navigation events
const initNavigation = () => {
    // Logout button
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Navigation.logout();
        });
    });
    
    // Navigation links
    const navLinks = document.querySelectorAll('a[data-route]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            if (route && ROUTES[route]) {
                Navigation.navigateTo(ROUTES[route]);
            }
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for use in other files
window.CareerSaarthi = {
    Navigation,
    ROLES,
    ROUTES
};
