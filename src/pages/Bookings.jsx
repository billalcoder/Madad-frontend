import { useEffect, useState } from "react";
import BookingCard from "../components/Bookingcard";

async function userBooking(setUserBooking) {
    const url = "https://madad-c0ci.onrender.com"
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