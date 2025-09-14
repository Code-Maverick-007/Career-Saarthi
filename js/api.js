// Mock API Service for CareerSaarthi

// Mock data storage
const mockData = {
    users: {
        'student@demo.com': {
            id: 1,
            name: 'John Doe',
            email: 'student@demo.com',
            role: 'student',
            password: 'student123',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
            savedColleges: [1, 2],
            connectedCounselors: [1],
            progress: 60
        },
        'counselor@demo.com': {
            id: 2,
            name: 'Sarah Johnson',
            email: 'counselor@demo.com',
            role: 'counselor',
            password: 'counselor123',
            profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
            students: [1],
            specialization: 'Career Counseling'
        },
        'admin@demo.com': {
            id: 3,
            name: 'Admin User',
            email: 'admin@demo.com',
            role: 'admin',
            password: 'admin123'
        }
    },
    colleges: [
        {
            id: 1,
            name: 'Stanford University',
            location: 'Palo Alto, CA',
            image: 'https://example.com/stanford.jpg',
            description: 'A leading research university',
            programs: ['Computer Science', 'Engineering', 'Business']
        },
        {
            id: 2,
            name: 'MIT',
            location: 'Cambridge, MA',
            image: 'https://example.com/mit.jpg',
            description: 'Institute of Technology',
            programs: ['Computer Science', 'Physics', 'Mathematics']
        }
    ],
    counselors: [
        {
            id: 1,
            name: 'Sarah Johnson',
            specialization: 'Career Counseling',
            rating: 4.8,
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            availableSlots: ['Mon 10:00 AM', 'Wed 2:00 PM', 'Fri 4:00 PM']
        }
    ]
};

// Simulate API delay
const simulateApiCall = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 500);
    });
};

// API Service
const ApiService = {
    // Auth
    login: async (email, password) => {
        const user = mockData.users[email];
        if (user && user.password === password) {
            const { password: _, ...userData } = user; // Remove password from response
            return simulateApiCall({
                success: true,
                token: `mock-jwt-token-${user.id}`,
                user: userData
            });
        }
        return simulateApiCall({
            success: false,
            message: 'Invalid credentials'
        });
    },

    // User
    getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return { success: false };
        
        // Extract user ID from mock token
        const userId = parseInt(token.replace('mock-jwt-token-', ''));
        const user = Object.values(mockData.users).find(u => u.id === userId);
        
        if (user) {
            const { password, ...userData } = user; // Remove password
            return simulateApiCall({ success: true, data: userData });
        }
        return simulateApiCall({ success: false });
    },

    // Colleges
    getColleges: async () => {
        return simulateApiCall({
            success: true,
            data: mockData.colleges
        });
    },

    getCollegeById: async (id) => {
        const college = mockData.colleges.find(c => c.id === parseInt(id));
        return simulateApiCall({
            success: !!college,
            data: college
        });
    },

    // Counselors
    getCounselors: async () => {
        return simulateApiCall({
            success: true,
            data: mockData.counselors
        });
    },

    // Appointments
    bookAppointment: async (counselorId, slot) => {
        // In a real app, this would create an appointment
        return simulateApiCall({
            success: true,
            message: 'Appointment booked successfully',
            data: {
                id: Date.now(),
                counselorId,
                slot,
                status: 'confirmed'
            }
        });
    },

    // Student
    getStudentProgress: async (studentId) => {
        // In a real app, this would fetch from the database
        return simulateApiCall({
            success: true,
            data: {
                completed: 60,
                total: 100,
                steps: [
                    { id: 1, name: 'Profile', completed: true },
                    { id: 2, name: 'Aptitude Test', completed: true },
                    { id: 3, name: 'Career Exploration', completed: true },
                    { id: 4, name: 'College Research', completed: false },
                    { id: 5, name: 'Application', completed: false }
                ]
            }
        });
    }
};

// Add to global namespace
window.ApiService = ApiService;
