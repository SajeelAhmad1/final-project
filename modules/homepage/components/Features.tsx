import React from 'react';

export default function Features() {
    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-3">
                    Academic System In One <span className="text-blue-500">Dashboard</span>
                </h1>
                <p className="text-gray-600 text-base">
                    View Real-Time Stats, Recent Activity, Upcoming Events, And System Notifications — All At A Glance.
                </p>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between gap-6 my-8">
                <div className="bg-gray-50 rounded-lg p-10 shadow-sm border border-gray-200 flex-1 flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L10 14L13 17L17 13M8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-center text-xl">Track Activities &</h2>
                    <h2 className="font-bold text-center text-xl">Attendance</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-10 shadow-sm border border-gray-200 flex-1 flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-center text-xl">Stay Notified About</h2>
                    <h2 className="font-bold text-center text-xl">Exams & Classes</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-10 shadow-sm border border-gray-200 flex-1 flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-center text-xl">Overview Of Schedules</h2>
                    <h2 className="font-bold text-center text-xl">& Enrollments</h2>
                </div>
            </div>

            <div className="flex gap-6 mt-4">
                <button className="bg-blue-500 text-white px-8 py-3 rounded-md text-base font-medium">
                    Sign up as Teacher
                </button>
                <button className="bg-blue-500 text-white px-8 py-3 rounded-md text-base font-medium">
                    Sign up as Student
                </button>
            </div>
        </div>
    );
}