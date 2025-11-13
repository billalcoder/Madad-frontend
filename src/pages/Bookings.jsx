import { useEffect, useState } from "react";
import BookingCard from "../components/Bookingcard";

async function userBooking(setUserBooking) {
    const url = import.meta.env.VITE_API_URL
    try {
        const res = await fetch(`${url}/booking/user`, { credentials: "include" })
        const data = await res.json()
        setUserBooking(data.bookings)
    } catch (error) {
        console.log(error);
    }
}

export default function Bookings() {
    const [userbooking, setUserBooking] = useState([])
    useEffect(() => {
         userBooking(setUserBooking)
    }, [])
    return (
        <BookingCard provider={userbooking}/>
    )
}