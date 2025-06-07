'use client';
import React, { useEffect, useState } from 'react';
import { Camera, User, Lock, Save, Eye, EyeOff, Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

const ProfileComponent = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuth();
    // Profile form state
    const [profileData, setProfileData] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        location: user?.location || ''
    });

    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const validatePassword = (password: string) => {
        const validations = {
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        setPasswordValidations(validations);
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (field === 'newPassword') {
            validatePassword(value);
        }
    };
    const isPasswordValid = Object.values(passwordValidations).every(Boolean);


    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                setTimeout(() => {
                    setProfileImage(reader.result);
                    setIsUploading(false);
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
    };

    const handleProfileSubmit = async () => {
        setLoading(true);
        // Handle profile update logic here
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile/update`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                phone: profileData.phone,
                bio: profileData.bio,
                location: profileData.location,
                profileImage: profileImage
            }),
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            const user = data.user;
            toast.success('Profile updated successfully!');
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                location: user.location
            });
            setProfileImage(data.profileImage || null);
            setLoading(false);
        } else {
            toast.error('Failed to update profile');
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        setLoading(true);
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile/password`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                old_assword: passwordData.currentPassword,
                new_password: passwordData.newPassword,
            }),
            cache: 'no-store',
        });

        if (res.ok) {
            const data = await res.json();
            const user = data.user;
            toast.success('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setLoading(false);
        } else {
            toast.error('Failed to update password');
            setLoading(false);
        }
        // Handle password update logic here
        

    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            toast.error('You must be logged in to view profile');
            window.location.href = '/';
        }
    }, []);


    return (
        <div className="min-h-screen bg-neutral-900 p-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden mb-8 border border-neutral-700">
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6 py-8 relative overflow-hidden">
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

                        <div className="flex items-center space-x-4 relative z-10">
                            {/* Profile Picture Section */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-neutral-700 backdrop-blur-sm">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-600 to-neutral-700">
                                            <User className="w-12 h-12 text-neutral-300" />
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full backdrop-blur-sm">
                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload/Remove buttons */}
                                <div className="absolute -bottom-2 -right-2 flex space-x-1">
                                    <label className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-all duration-300 hover:scale-110 border border-white/20">
                                        <Camera className="w-5 h-5 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    {profileImage && (
                                        <button
                                            onClick={removeImage}
                                            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border border-white/20"
                                        >
                                            <X className="w-5 h-5 text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="text-white">
                                <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">
                                    {profileData.firstName} {profileData.lastName}
                                </h1>
                                <p className="text-white/80 text-base drop-shadow-md">{profileData.email}</p>
                                <p className="text-white/70 mt-1 drop-shadow-md">{profileData.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-neutral-700 bg-neutral-800">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-4 py-3 text-center font-medium transition-all duration-300 ${activeTab === 'profile'
                                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-neutral-700/50'
                                : 'text-neutral-400 hover:text-indigo-300 hover:bg-neutral-700/30'
                                }`}
                        >
                            <User className="w-5 h-5 inline-block mr-2" />
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 px-4 py-3 text-center font-medium transition-all duration-300 ${activeTab === 'password'
                                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-neutral-700/50'
                                : 'text-neutral-400 hover:text-indigo-300 hover:bg-neutral-700/30'
                                }`}
                        >
                            <Lock className="w-5 h-5 inline-block mr-2" />
                            Password & Security
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-700">
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    readOnly
                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => handleProfileChange('location', e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                    placeholder="Enter your location"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-neutral-400"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleProfileSubmit}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] border border-indigo-500/20"
                            >
                                <Save className="w-5 h-5" />
                                <span>Update Profile</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                        placeholder="Enter your current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                        placeholder="Enter your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-neutral-400"
                                        placeholder="Confirm your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-neutral-700/50 border border-neutral-600 rounded-lg p-4 backdrop-blur-sm">
                                <h4 className="text-sm font-medium text-neutral-200 mb-2">Password Requirements:</h4>
                                <ul className="text-sm text-neutral-400 space-y-1">
                                    {[
                                        { label: 'At least 8 characters long', key: 'minLength' },
                                        { label: 'Contains at least one uppercase letter', key: 'hasUpper' },
                                        { label: 'Contains at least one lowercase letter', key: 'hasLower' },
                                        { label: 'Contains at least one number', key: 'hasNumber' },
                                        { label: 'Contains at least one special character', key: 'hasSpecialChar' },
                                    ].map(({ label, key }) => (
                                        <li key={key} className="flex items-center space-x-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${passwordValidations[key] ? 'bg-green-400' : 'bg-neutral-500'}`}></span>
                                            <span className={passwordValidations[key] ? 'text-green-400' : ''}>{label}</span>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                            <button
                                type="button"
                                onClick={handlePasswordSubmit}
                                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] border border-indigo-500/20 ${!isPasswordValid || passwordData.newPassword !== passwordData.confirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isPasswordValid || passwordData.newPassword !== passwordData.confirmPassword}
                            >
                                <Lock className="w-5 h-5" />
                                <span>Update Password</span>
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;