'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface Order {
    productName: string;
    color: string;
    category: string;
    amount: number;
    paymentStatus: string;
}

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/';
        toast.error('You must be logged in to view bookings');
        return;
    }

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/booking`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (res.ok) {
                const data = await res.json();
                setBookings(data.orders || []);
                setLoading(false);
            } else {
                console.error('Failed to load bookings');
                window.location.href = '/';
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-black flex justify-center p-6">
            <div className="w-full max-w-6xl bg-neutral-900/80 border border-neutral-700 rounded-2xl shadow-2xl">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">Your Bookings</h2>
                    {
                        bookings.length > 0 ? (
                            <>
                                <div className="relative overflow-x-auto rounded-lg border border-neutral-700">
                                    <table className="w-full text-sm text-left text-neutral-300">
                                        <thead className="text-xs uppercase bg-neutral-800 text-neutral-400">
                                            <tr>
                                                <th className="px-6 py-3">Product Name</th>
                                                <th className="px-6 py-3">Color</th>
                                                <th className="px-6 py-3">Category</th>
                                                <th className="px-6 py-3">Price</th>
                                                <th className="px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking: Order, index) => (
                                                <tr key={index} className="border-b border-neutral-700 hover:bg-neutral-800">
                                                    <td className="px-6 py-4 font-semibold text-white">{booking.productName}</td>
                                                    <td className="px-6 py-4">{booking.color}</td>
                                                    <td className="px-6 py-4">{booking.category}</td>
                                                    <td className="px-6 py-4">${booking.amount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${booking.paymentStatus === 'Paid' ? 'bg-green-700 text-green-300' : 'bg-red-700 text-red-300'
                                                            }`}>{booking.paymentStatus}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {bookings.length > 10 && (
                                    <nav className="flex items-center justify-between pt-6 text-sm text-neutral-400">
                                        <span>Showing <span className="text-white font-semibold">1-10</span> of <span className="text-white font-semibold">1000</span></span>
                                        <ul className="inline-flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((page) => (
                                                <li key={page}>
                                                    <a href="#" className={`px-3 py-1 rounded-md ${page === 3 ? 'bg-indigo-700 text-white' : 'hover:bg-neutral-700 hover:text-white'}`}>
                                                        {page}
                                                    </a>
                                                </li>
                                            ))}
                                            <li>
                                                <a href="#" className="px-3 py-1 rounded-md hover:bg-neutral-700 hover:text-white">Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <p className="text-neutral-400">No bookings found.</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
