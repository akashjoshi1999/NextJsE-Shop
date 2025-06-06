'use client'

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { selectCurrentUser } from "@/store/slices/auth/authSelectors"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useModal } from "@/hooks/useModal"

interface Product {
    _id: string
    name: string
    price: number
    image: string
}

interface BuyButtonProps {
    product: Product,
}

export default function BuyButton({ product }: BuyButtonProps) {
    const [loading, setLoading] = useState(false)
    const user = useAppSelector(selectCurrentUser)
    const userId = user?.id || ""

    const { open: openLoginModal } = useModal('loginModal')

    useEffect(() => {
        console.log("User changed:", user)
    }, [user])

    const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        if (!user) {
            openLoginModal()
            return
        }
        
        setLoading(true)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product, userId }),
            })

            const data = await res.json()

            if (!res.ok) {
                console.error("Checkout error:", data)
                alert(data.error || "Something went wrong during checkout")
                return
            }

            if (data?.url) {
                window.location.href = data.url
            }
        } catch (error: unknown) {
            console.error("Error during checkout:", error)
            alert("Failed to initiate checkout. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            aria-label="Add to cart"
            className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={loading}
        >
            <div className="absolute left-0 ml-4">
                {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <Plus className="h-5 w-5" />
                )}
            </div>
            {loading ? "Processing..." : "Buy Now"}
        </button>
    )
}
