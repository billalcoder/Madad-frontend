import { useEffect, useState, useRef } from "react";
import InputField from "../components/InputField";
import BtnComponent from "../components/BtnComponent";
import HaveAcc from "../components/HaveAcc";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setform] = useState({ email: "", password: "" });
  const [error, seterror] = useState("");
  const url = "https://madad-c0ci.onrender.com";
  const googleBtn = useRef(null); // ✅ Ref to attach Google button

  // ✅ Initialize Google login when component mounts
  useEffect(() => {
    /* global google */ // let eslint know google is global
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "854104136103-pd3n2tps6n0pfpo8k9h2qonef1tvdbc1.apps.googleusercontent.com",
        callback: async (res) => {
          try {
            const apiRes = await fetch(`${url}/user/google`, {
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
              location.href = "https://islamic-studies.netlify.app";
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

  // ✅ handle input change
  function onchange(e) {
    setform({ ...form, [e.target.name]: e.target.value });
    seterror("");
  }

  // ✅ handle normal email/password login
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.password) return seterror("Password is required");
    if (!form.email) return seterror("Email is required");

    try {
      const res = await fetch(`${url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Login successful ✅");
        navigate("/");
      } else {
        seterror(
          data.error?.[0]?.message ||
            data.error?.[0]?.code ||
            data.error ||
            "Something went wrong"
        );
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
        <div className="title text-xl font-semibold text-gray-800">
          Login to your Account
        </div>

        <div className="inputs w-full flex flex-col space-y-4">
          <InputField
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={form.email}
            onChange={onchange}
            icon={"mail"}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={onchange}
            icon={"lock"}
          />
          <p className="text-red-500">{error}</p>

          <BtnComponent text="Login" onClick={handleSubmit} />
          <div ref={googleBtn} className="flex justify-center mt-4"></div>
          <HaveAcc />
        </div>
      </div>
    </div>
  );
}
