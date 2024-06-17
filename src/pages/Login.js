import React, { useState, useEffect } from "react";
import Logo from "../assets/timetofill.png";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() =>{
        let login = localStorage.getItem("login");
        if(login){
            navigate("/home");
        }
        let loginStatus = localStorage.getItem("loginStatus");
        if(loginStatus){
            setError(loginStatus);
            localStorage.clear();
            window.location.reload();
        }
    })

    const handleInput = (e, type) => {
        setError("");
        if (type === "user") {
            setUser(e.target.value);
        } else if (type === "pass") {
            setPass(e.target.value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user !== "" && pass !== "") {
            var url = "http://localhost/timetofill/login.php";
            var headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            var data = { user, pass };
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            }).then(response => response.json())
            .then((response) => {
                if(response[0].result === "Invalid Username!" || response[0].result === "Invalid Password!"){
                    setError(response[0].result);
                }
                else{
                    localStorage.setItem("login", true);
                    localStorage.setItem("user", user);
                    // localStorage.setItem("logged_data", response[0].user);
                    localStorage.setItem("logged_data", JSON.stringify(response[0].user));
                    navigate("/home");
                }
            }).catch(error => {
                setError(error);
                console.error("Error:", error);
                });
            } else {
              setError("All fields are required!");
        }
    };


    return (
        <>
            <div className="hidden lg:flex h-full w-1/2 items-center justify-center bg-[#577BC1] border-r-[40px] border-indigo-950">
                <div className="w-full max-w-72 items-center justify-center">
                    <p className="text-6xl text-[#f8fafc] tracking-widest">TimeToFill</p>
                    <img className="size-72" src={Logo} alt="TimeToFill Logo" />
                </div>
            </div>
            <div className="w-full flex items-center justify-center lg:w-1/2">
                <div className="w-full max-w-80 items-center justify-center grid">
                    <p className="text-5xl text-blue-800 text-center tracking-widest mb-8">Login</p>
                    <form onSubmit={handleSubmit}>
                        <div className="relative inline-block mb-6">
                            <input
                                type="text"
                                className="w-80 h-12 px-4 peer pt-4 pb-2 text-blue-900 bg-transparent border border-blue-950 rounded focus:border-blue-900 focus:outline-none"
                                id="username"
                                name="username"
                                placeholder=""
                                value={user}
                                onChange={(e) => handleInput(e, "user")}
                            />
                            <label
                                htmlFor="username"
                                className="
                                    absolute peer-placeholder-shown:top-1/2 top-3 font-semibold
                                    left-4 -translate-y-1/2 cursor-text text-blue-950
                                    text-xs peer-placeholder-shown:text-base
                                    peer-focus:top-3 peer-focus:text-xs transition-all
                                ">
                                Username
                            </label>
                        </div>
                        <div className="relative inline-block mb-2">
                            <input
                                type="password"
                                className="w-80 h-12 px-4 peer pt-4 pb-2 text-blue-900 bg-transparent border border-blue-950 rounded focus:border-blue-900 focus:outline-none"
                                id="password"
                                name="password"
                                value={pass}
                                placeholder=""
                                onChange={(e) => handleInput(e, "pass")}
                            />
                            <label
                                htmlFor="password"
                                className="
                                    absolute peer-placeholder-shown:top-1/2 top-3 font-semibold
                                    left-4 -translate-y-1/2 cursor-text text-blue-950
                                    text-xs peer-placeholder-shown:text-base
                                    peer-focus:top-3 peer-focus:text-xs transition-all
                                ">
                                Password
                            </label>
                        </div>
                        <p className="mb-6 text-red-700">
                            {error && <span>{error}</span>}
                        </p>
                        <div className="flex justify-center w-full">
                            <button type="submit" className="w-32 h-10 rounded bg-blue-800 text-[#f8fafc] text-base tracking-wide hover:bg-blue-700 hover:text-yellow-200">Login</button>
                        </div>
                    </form>
                    <div className="h-2"></div>
                    <div className="flex justify-center w-full gap-2 text-sm text-blue-950">
                        <p>Don't have an account?</p>
                        <Link to="/signup" className="font-semibold underline underline-offset-1 hover:text-blue-700">Sign Up!</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
