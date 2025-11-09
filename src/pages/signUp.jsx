import { useEffect, useRef, useState } from "react"
import InputField from "../components/InputField"
import Checkbox from "../components/Checkbox"
import BtnComponent from "../components/BtnComponent"
import HaveAcc from "../components/HaveAcc"
import { useNavigate } from "react-router-dom"

export default function Signup() {
    const navigate = useNavigate()
    const [form, setform] = useState({ name: "", email: "", password: "" })
    const [check, setcheck] = useState(false)
    const [error, seterror] = useState("")
    
    // --- OTP States ---
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpStatus, setOtpStatus] = useState(""); 
    
    // --- Timer States ---
    const [timer, setTimer] = useState(0); // Countdown timer
    const [otpSent, setOtpSent] = useState(false); // Tracks if OTP was sent at least once

    const googleBtn = useRef(null);
    const navigator = useNavigate()
    const url = "https://madad-c0ci.onrender.com"

    function handleFormChange(e) {
        setform({ ...form, [e.target.name]: e.target.value });
        seterror("");
    }

    function handleCheckChange(e) {
        setcheck(e.target.checked);
        seterror("");
    }
    
    // --- Google Login useEffect (unchanged) ---
    useEffect(() => {
        /* global google */ 
        if (window.google) {
            google.accounts.id.initialize({
                client_id:
                    "978012455765-5mp6056u22m5t3oei2jq3c8ur6msmg13.apps.googleusercontent.com",
                callback: async (res) => {
                    try {
                        const apiRes = await fetch(`${url}/user/google-login`, {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify(res),
                        });
                        const apiData = await apiRes.json();
                        if (apiData) {
                            alert("Google login successful ✅");
                            navigator("/")
                        }
                    } catch (err) {
                        console.error("Google login error:", err);
                    }
                },
            });
            google.accounts.id.renderButton(googleBtn.current, {
                type: "standard", theme: "outline", size: "large", shape: "pill", width: "250",
            });
            google.accounts.id.prompt();
        }
    }, [url, navigator]);

    // --- New Timer useEffect ---
    useEffect(() => {
        let interval;
        if (timer > 0) {
            // Set a timeout that calls setTimer to decrease the timer by 1
            interval = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000); // 1000ms = 1 second
        }
        
        // This is the cleanup function. It clears the timeout if the
        // component unmounts or if 'timer' changes before the timeout finishes.
        return () => clearTimeout(interval);
    }, [timer]); // This effect will re-run every time the 'timer' state changes

    // --- Function: handleSendOtp (Updated) ---
    async function handleSendOtp() {
        if (!form.email) {
            seterror("Please enter your email first.");
            return;
        }
        setOtpStatus("Sending OTP...");
        seterror("");
        try {
            const res = await fetch(`${url}/user/sendOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpStatus("OTP sent to your email! ✅");
                setTimer(60); // ⏰ Start the 60-second timer
                setOtpSent(true); // Mark that OTP has been sent
            } else {
                seterror(data.error || "Failed to send OTP");
                setOtpStatus("");
            }
        } catch (err) {
            console.error(err);
            seterror("Network error, please try again.");
            setOtpStatus("");
        }
    }

    // --- Function: handleVerifyOtp (Unchanged) ---
    async function handleVerifyOtp() {
        if (!form.email || !otp) {
            seterror("Please enter email and OTP.");
            return;
        }
        setOtpStatus("Verifying OTP...");
        seterror("");
        try {
            const res = await fetch(`${url}/user/varifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp: otp }),
            });
            const data = await res.json();
            if (res.ok) {
                setOtpStatus("OTP Verified Successfully! ✅");
                setIsOtpVerified(true);
                seterror("");
                setTimer(0); // Stop timer on successful verification
            } else {
                seterror(data.error || "Invalid OTP");
                setOtpStatus("");
                setIsOtpVerified(false);
            }
        } catch (err) {
            console.error(err);
            seterror("Network error, please try again.");
            setOtpStatus("");
        }
    }

    // --- Function: handleSubmit (Unchanged) ---
    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name) return seterror("Name is required")
        if (!form.password) return seterror("Password is required")
        if (!form.email) return seterror("Email is required")
        if (!check) return seterror("Accept terms and condition")
        if (!isOtpVerified) return seterror("Please verify your OTP"); 
        
        try {
            const res = await fetch(`${url}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Signup successful ✅");
                navigate("/login")
            } else {
                seterror(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            seterror("Network error");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col items-center space-y-6">
                <div className="logo text-2xl font-bold text-blue-600">Logo</div>
                <div className="title text-xl font-semibold text-gray-800">Create Account</div>
                <div className="inputs w-full flex flex-col space-y-4">
                    <InputField type="text" name={"name"} placeholder="Enter your Name" value={form.name} onChange={handleFormChange} icon={"user"}/>
                    <InputField type="email" name={"email"} placeholder="Enter your Email" value={form.email} onChange={handleFormChange} icon={"mail"}/>
                    
                    {/* --- OTP Section (Button Updated) --- */}
                    <button 
                        type="button" 
                        onClick={handleSendOtp}
                        disabled={timer > 0} // 👈 Disable button if timer is running
                        className={`w-full -mt-2 py-2 px-4 bg-gray-200 text-gray-800 rounded-xl font-medium transition-all ${
                            timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                        }`}
                    >
                        {/* 👈 Conditional text */}
                        {timer > 0 ? `Resend in ${timer}s` : (otpSent ? "Resend OTP" : "Send OTP")}
                    </button>

                    <div className="w-full flex items-end space-x-2">
                        <div className="flex-1">
                            <InputField 
                                type="text" 
                                name="otp" 
                                placeholder="Enter OTP" 
                                value={otp} 
                                onChange={(e) => { setOtp(e.target.value); seterror(""); setOtpStatus(""); }} 
                                icon={"lock"}
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleVerifyOtp} 
                            className="whitespace-nowrap px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all mb-4 h-[42px]"
                        >
                            Verify OTP
                        </button>
                    </div>
                    {otpStatus && <p className="text-blue-600 -mt-8 text-center">{otpStatus}</p>}
                    {/* --- OTP Section End --- */}

                    <InputField type="password" name={"password"} placeholder="Enter your Password" value={form.password} onChange={handleFormChange} icon={"lock"}/>
                    <Checkbox checked={check} onChange={handleCheckChange} name={"terms"} />
                    <p className="text-red-500 b-500">{error}</p>
                    
                    <BtnComponent 
                        text="Sign Up" 
                        onClick={handleSubmit} 
                        disabled={!isOtpVerified || !check} 
                    />
                    
                    <HaveAcc />
                    <div ref={googleBtn} className="flex justify-center mt-4"></div>
                </div>
            </div>
        </div>
    )
}