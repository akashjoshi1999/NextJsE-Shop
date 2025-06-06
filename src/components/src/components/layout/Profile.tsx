'use client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('You have successfully logged out');
            setOpen(false);
        } catch (error) {
            toast.error('Logout failed');
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="text-white font-medium text-sm inline-flex items-center"
                type="button"
            >
                <div className="relative w-10 h-10 overflow-hidden bg-white-100 rounded-full dark:bg-white-600">
                    <svg
                        className="absolute w-12 h-12 text-white -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 z-10 w-44 mt-2 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
                    <div className="px-4 py-3 text-sm text-white">
                        <div>{user?.name}</div>
                        <div className="font-medium truncate text-gray-400">{user?.email}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-300">
                        <li>
                            <Link
                                href="/profile"
                                className="block px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                            >
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="booking"
                                className="block px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                            >
                                Booking
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="block px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                    <div className="py-2 border-t border-gray-700">
                        <Link
                            href="#"
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                        >
                            Sign out
                        </Link>
                    </div>
                </div>

            )}
        </div>
    );
};

export default Profile;
