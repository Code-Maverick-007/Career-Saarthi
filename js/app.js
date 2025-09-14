// Main application state
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    currentView: 'login',
    
    init() {
        // Check if user is already logged in
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
            this.navigate('dashboard');
        } else {
            this.navigate('login');
        }
        
        // Initialize event listeners
        this.initEventListeners();
    },
    
    initEventListeners() {
        // Login form submission
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            this.login(email, password);
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
        
        // Navigation links
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.getAttribute('data-route');
                this.navigate(route);
            });
        });
    },
    
    login(email, password) {
        // In a real app, this would be an API call
        const user = AuthService.authenticate(email, password);
        if (user) {
            this.currentUser = user;
            this.isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.navigate('dashboard');
            UI.showNotification('Login successful!', 'success');
        } else {
            UI.showNotification('Invalid credentials', 'error');
        }
    },
    
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        this.navigate('login');
    },
    
    navigate(view) {
        this.currentView = view;
        window.location.hash = view;
        this.render();
    },
    
    render() {
        // Clear the main content
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        // Show appropriate view based on authentication and route
        if (!this.isAuthenticated && this.currentView !== 'login') {
            this.navigate('login');
            return;
        }
        
        switch(this.currentView) {
            case 'dashboard':
                mainContent.innerHTML = this.renderDashboard();
                break;
            case 'profile':
                mainContent.innerHTML = this.renderProfile();
                break;
            case 'login':
            default:
                mainContent.innerHTML = this.renderLogin();
        }
        
        // Re-initialize event listeners after rendering
        this.initEventListeners();
    },
    
    renderLogin() {
        return `
            <div class="login-container">
                <div class="p-6">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Career Saarthi</h1>
                        <p class="text-gray-600">Your personal career guidance platform</p>
                    </div>

                    <form id="loginForm" class="space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="password" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password">
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                    </form>

                    <div class="text-center mt-4">
                        <button id="demoLogin" class="text-blue-600 text-sm hover:underline">
                            Try Demo Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderDashboard() {
        if (!this.currentUser) return '';
        
        return `
            <div class="container mx-auto px-4 py-6">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Welcome, ${this.currentUser.name}</h1>
                    <button id="logoutBtn" class="flex items-center text-gray-600 hover:text-gray-800">
                        <span class="material-icons mr-1">logout</span>
                        Logout
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Quick Stats -->
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <h2 class="text-lg font-semibold mb-4">Your Progress</h2>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Profile Completion</span>
                                    <span class="text-sm font-medium">75%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-1">
                                    <span class="text-sm font-medium">Applications</span>
                                    <span class="text-sm font-medium">2/5</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 40%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Upcoming Deadlines -->
                    <div class="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-semibold">Upcoming Deadlines</h2>
                            <button class="text-blue-600 text-sm font-medium">View All</button>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center p-3 border border-gray-100 rounded-lg">
                                <div class="p-2 bg-blue-50 rounded-lg mr-3">
                                    <span class="material-icons text-blue-600">school</span>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-medium">IIT Bombay Application</h3>
                                    <p class="text-sm text-gray-500">Due in 5 days</p>
                                </div>
                                <span class="text-sm text-gray-500">Dec 15</span>
                            </div>
                            <div class="flex items-center p-3 border border-gray-100 rounded-lg">
                                <div class="p-2 bg-purple-50 rounded-lg mr-3">
                                    <span class="material-icons text-purple-600">assignment</span>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-medium">Scholarship Form</h3>
                                    <p class="text-sm text-gray-500">Due in 2 weeks</p>
                                </div>
                                <span class="text-sm text-gray-500">Dec 22</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="md:col-span-3">
                        <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <a href="#" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <span class="material-icons text-blue-500 text-3xl mb-2">school</span>
                                <span class="font-medium">Find Colleges</span>
                            </a>
                            <a href="#" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <span class="material-icons text-green-500 text-3xl mb-2">search</span>
                                <span class="font-medium">Explore Careers</span>
                            </a>
                            <a href="#" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <span class="material-icons text-purple-500 text-3xl mb-2">description</span>
                                <span class="font-medium">My Applications</span>
                            </a>
                            <a href="#" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center text-center">
                                <span class="material-icons text-amber-500 text-3xl mb-2">person</span>
                                <span class="font-medium">My Profile</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderProfile() {
        if (!this.currentUser) return '';
        
        return `
            <div class="container mx-auto px-4 py-6 max-w-3xl">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
                    <button id="logoutBtn" class="flex items-center text-gray-600 hover:text-gray-800">
                        <span class="material-icons mr-1">logout</span>
                        Logout
                    </button>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="flex flex-col md:flex-row items-center mb-6">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                            <span class="material-icons text-4xl text-gray-400">person</span>
                        </div>
                        <div class="text-center md:text-left">
                            <h2 class="text-xl font-semibold">${this.currentUser.name}</h2>
                            <p class="text-gray-600">${this.currentUser.email}</p>
                            <p class="text-sm text-gray-500 mt-1">${this.currentUser.role === 'student' ? 'Student' : 'Counselor'}</p>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-100 pt-6">
                        <h3 class="text-lg font-medium mb-4">Personal Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value="${this.currentUser.name}" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value="${this.currentUser.email}" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" value="+91 9876543210" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" value="2000-01-01" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        
                        <div class="mt-6 flex justify-end space-x-3">
                            <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <a href="#dashboard" data-route="dashboard" class="text-blue-600 hover:underline">
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        `;
    }
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    
    // Handle hash changes for SPA navigation
    window.addEventListener('hashchange', () => {
        const view = window.location.hash.substring(1) || 'dashboard';
        AppState.navigate(view);
    });
});
