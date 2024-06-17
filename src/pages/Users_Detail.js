import {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UsersDetail() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const {id} = useParams();
    //console.log(id);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserData(values => ({...values, [name]: value}));
    }

    useEffect( () => {
        getUserData();
        //console.log(userData[id]);
      }, []);
    
    function getUserData(){
        axios.get(`http://localhost/timetofill/users.php`, id).then(function(response){
            setUserData(response.data);
            console.log(userData);
        });
        
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
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="username"
                    name="username"
                    placeholder=""
                    value={logged_data['username']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Name
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="name"
                    name="name"
                    placeholder=""
                    value={logged_data['name']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Category
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="category"
                    name="category"
                    placeholder=""
                    value={logged_data['category']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Class
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="class"
                    name="class"
                    placeholder=""
                    value={logged_data['class']}
                />
            </div>
            <div className= "w-80 mb-2">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Email
                </label>
                <input
                    type="text"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="email"
                    name="email"
                    placeholder=""
                    value={logged_data['email']}
                />
            </div>
            <div className= "w-80 mb-6">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Status
                </label>
                <input
                    type="password"
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    id="password"
                    name="password"
                    placeholder=""
                    value={logged_data['password']}
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