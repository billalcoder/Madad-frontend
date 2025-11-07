
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
    const googleBtn = useRef(null);
    const navigator = useNavigate()
    const url = "http://localhost:4000"
    function onchange(e) {
        setform({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })
        console.log(e.target.type);
        setcheck(e.target.checked)
        seterror("")
    }
    useEffect(() => {
        /* global google */ // let eslint know google is global
        if (window.google) {
            google.accounts.id.initialize({
                client_id:
                    "978012455765-5mp6056u22m5t3oei2jq3c8ur6msmg13.apps.googleusercontent.com",
                callback: async (res) => {
                    try {
                        const apiRes = await fetch(`${url}/user/google-login`, {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify(res),
                        });

                        const apiData = await apiRes.json();
                        console.log(apiData);

                        if (apiData) {
                            alert("Google login successful ✅");
                           navigator("/")
                        }
                    } catch (err) {
                        console.error("Google login error:", err);
                    }
                },
            });

            // ✅ Render Google login button inside the div
            google.accounts.id.renderButton(googleBtn.current, {
                type: "standard",
                theme: "outline",
                size: "large",
                shape: "pill",
                width: "250",
            });

            google.accounts.id.prompt();
        }
    }, [url]);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(form);
        if (!form.name[0]) return seterror("Name is required")
        if (!form.password[0]) return seterror("Password is required")
        if (!form.email[0]) return seterror("Email is required")
        if (!check) return seterror("Accept terms and condition")
        try {
            const res = await fetch(`${url}/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                    <InputField type="text" name={"name"} placeholder="Enter your Name" value={form.name} onChange={onchange} />
                    <InputField type="email" name={"email"} placeholder="Enter your Email" value={form.email} onChange={onchange} />
                    <InputField type="password" name={"password"} placeholder="Enter your Password" value={form.password} onChange={onchange} />
                    <Checkbox checked={check} onChange={onchange} name={"terms"} />
                    <p className="text-red-500 b-500">{error}</p>
                    <BtnComponent text="Sign Up" onClick={handleSubmit} />
                    <HaveAcc />
                    <div ref={googleBtn} className="flex justify-center mt-4"></div>
                </div>
            </div>
        </div>
    )
}