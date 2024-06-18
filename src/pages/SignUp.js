    import React, { useState} from "react";
    import Logo from "../assets/timetofill.png";
    import { Link, useNavigate } from "react-router-dom";
    import Validation from "../components/SignupValidation";
    import axios from "axios";

    export default function Login() {
        const [values, setValues] = useState({
            email: '',
            username: '',
            password:''
        })

        const navigate = useNavigate();

        const[errors, setErrors] = useState({})

        const handleInput = (event) => {
            setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
        }

        const handleSubmit = (event) => {
            event.preventDefault();
            const err = Validation(values);
            setErrors(err);
            if(err.email === "" && err.username === "" && err.password === ""){
                const flattenedValues = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value[0]]));
                axios.put(`http://localhost/timetofill/signup.php`, JSON.stringify(flattenedValues))
                .then(function(response){
                    console.log(response.data);
                    alert(response.data['message']);
                    navigate('/');
                })
                .catch(function(error){
                    console.error("There was an error!", error);
                });
            }
        }

        return (
        <>
        <div className="hidden lg:flex h-full w-1/2 items-center justify-center bg-[#577BC1] border-r-[40px] border-indigo-950">
            <div className="w-full max-w-72 items-center justify-center">
                <p className="text-6xl text-[#f8fafc] tracking-widest ">TimeToFill</p>
                <img className="size-72 " src={Logo} alt="TimeToFill Logo"></img>
            </div>
        </div>
        <div className="w-full flex items-center justify-center lg:w-1/2">
            <div className="w-full max-w-80 items-center justify-center grid gap-4">
                <p className="text-5xl text-blue-800 text-center tracking-widest mb-4">Sign Up</p>
                <form action="" onSubmit={handleSubmit} >
                    <div className="relative inline-block mb-6">
                        <input 
                            type="text" 
                            className="w-80 h-12 px-4 peer pt-4 pb-2 text-blue-900 bg-transparent border border-blue-950 rounded focus:border-blue-900 focus:outline-none" 
                            id="email"
                            name="email"
                            placeholder=""
                            onChange={handleInput} />
                        <label 
                            htmlFor="email" 
                            className="
                            absolute peer-placeholder-shown:top-1/2 top-3 font-semibold
                            left-4 -translate-y-1/2 cursor-text text-blue-950
                            text-xs peer-placeholder-shown:text-base
                            peer-focus:top-3 peer-focus:text-xs transition-all
                            ">
                            Email
                        </label>
                        {errors.email && <span className="text-danger">{errors.email}</span> }
                    </div>
                    <div className="relative inline-block mb-6">
                        <input 
                            type="text" 
                            className="w-80 h-12 px-4 peer pt-4 pb-2 text-blue-900 bg-transparent border border-blue-950 rounded focus:border-blue-900 focus:outline-none" 
                            id="username"
                            name="username"
                            placeholder=""
                            onChange={handleInput} />
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
                        {errors.username && <span className="text-danger">{errors.username}</span> }
                    </div>
                    <div className="relative inline-block mb-6">
                        <input 
                            type="password" 
                            className="w-80 h-12 px-4 peer pt-4 pb-2 text-blue-900 bg-transparent border border-blue-950 rounded focus:border-blue-900 focus:outline-none" 
                            id="password"
                            name="password"
                            placeholder="" 
                            onChange={handleInput} />
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
                        {errors.password && <span className="text-danger">{errors.password}</span> }
                    </div>
                    <div className="flex justify-center w-full">
                        <button type="submit" className="w-32 h-10 rounded bg-blue-800 text-[#f8fafc] text-base tracking-wide hover:bg-blue-700 hover:text-yellow-200">sign up</button>    
                        {/* <Link to="/home" className="w-32 h-10 py-2 text-center rounded bg-blue-800 text-[#f8fafc] text-base tracking-wide hover:bg-blue-700 hover:text-yellow-200">login</Link>     */}
                    </div>
                </form>
                <div className="h-2"></div>
                <div className="flex justify-center w-full gap-2 text-sm text-blue-950">
                    <p>Already has account?</p>
                    <Link to="/" className="font-semibold underline underline-offset-1 hover:text-blue-700">Login</Link>
                </div>
            </div>
        </div>
        </>
        )
    }