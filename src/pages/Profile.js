import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        // getUserData();
        console.log(userData);
    }, []);

    // function getUserData(){
    //     axios.get(`http://localhost/timetofill/profile.php`, ).then(function(response){
    //         console.log(response.data);
    //         setUserData(response.data);
    //     });
        
    // }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserData(values => ({...values, [name]: value}));
    }

    const handleSubmit = (event)=>{
        event.preventDefault();

        // axios.put(`http://localhost/timetofill/profile.php`, userData).then(function(response) {
        //     console.log(response.data);
        //     navigate('/');
        // });
    }


    

    return (
    <>
      <div>
        <NavBar />
        <p className="text-5xl text-blue-800 text-center tracking-widest mt-14 mb-6">Profile</p>
        <div className="flex items-center justify-center">
          <form>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Username
                </label>
                <input disabled
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded disabled:bg-slate-100 "
                    id="username"
                    name="username"
                    placeholder=""
                    value={userData.username}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Name
                </label>
                <input disabled
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded disabled:bg-slate-100 "
                    id="name"
                    name="name"
                    placeholder=""
                    value={userData.name}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Category
                </label>
                <input disabled
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded disabled:bg-slate-100 "
                    id="category"
                    name="category"
                    placeholder=""
                    value={userData.category}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Class
                </label>
                <input disabled
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded disabled:bg-slate-100 "
                    id="class"
                    name="class"
                    placeholder=""
                    value={userData.classs}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Email
                </label>
                <input disabled
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded disabled:bg-slate-100 "
                    id="email"
                    name="email"
                    placeholder=""
                    value={userData.email}
                />
            </div>
            <div className= "w-80 mb-6">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Password
                </label>
                <input
                    type="password"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="password"
                    name="password"
                    placeholder=""
                    value={userData.password}
                    onChange={handleChange}
                />
            </div>
            <div className= " mb-2 px-4 tracking-widest text-[#f8fafc]">
                <button className="w-32 h-8 rounded bg-[#577BC1] mr-6 ">Save</button>
                <button  className="w-32 h-8 rounded bg-[#577BC1] ">Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}