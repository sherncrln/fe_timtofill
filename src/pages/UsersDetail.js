import {useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams  } from "react-router-dom";
import axios from "axios";

export default function UsersDetail() {
    const logged_data = JSON.parse(localStorage.getItem("logged_data"));
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const {id} = useParams();

    const backToUsersPage = () => {
        navigate('/users');
    };
    
    useEffect( () => {
        getUserData();
    }, []);
    
    function getUserData(){
        axios.get(`http://localhost/timetofill/users.php/${id}`, userData).then(function(response){
            setUserData(response.data);
        });
        
    }
    
        const handleChange = (event) => {
            const name = event.target.name;
            const value = event.target.value;
            setUserData(values => ({...values, [name]: value}));
        }
    
    const handleSubmit = (event)=>{
        event.preventDefault();
        axios.put(`http://localhost/timetofill/users.php/${id}`, JSON.stringify(userData))
            .then(function(response){
                console.log(response.data);
                setUserData(response.data);
                backToUsersPage();
            })
            .catch(function(error){
                console.error("There was an error!", error);
            });
    }

  return (
    <>
      <div>
        <NavBar />
        <p className="text-5xl text-blue-800 text-center tracking-widest mt-14 mb-6">User Detail</p>
        <div className="flex items-center justify-center">
          <form onSubmit={handleSubmit}>
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
                    value={userData.username}
                    onChange={handleChange}
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
                    value={userData.name}
                    onChange={handleChange}
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
                    value={userData.category}
                    onChange={handleChange}
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
                    value={userData.class}
                    onChange={handleChange}
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
                    value={userData.email}
                    onChange={handleChange}
                />
            </div>
            <div className= "w-80 mb-6">
                <label
                    className="text-sm text-blue-950 text-bold font-semibold">
                    Status
                </label>
                <select 
                    id="status_user" 
                    name="status_user" 
                    className="w-80 h-10 px-4 peer py-2 text-blue-900 bg-transparent border border-blue-950 rounded"
                    value={userData.status_user}
                    onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Non Active">Non Active</option>
                </select>
            </div>
            <div className= " mb-2 px-4 tracking-widest text-[#f8fafc]">
                <button className="w-32 h-8 rounded bg-[#577BC1] mr-6 ">Save</button>
                <button onClick={backToUsersPage} className="w-32 h-8 rounded bg-[#577BC1] ">Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
);
}