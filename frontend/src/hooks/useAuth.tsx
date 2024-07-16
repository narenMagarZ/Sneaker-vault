import { createContext, useContext, useEffect, useState } from "react"
import API from "../utils";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<{
  id:number
  email:string,
  logout:()=>void
}|null>(null)

export default function AuthProvider({children}:{children:React.ReactNode}){
  // const navigate = useNavigate()
  const [user,setUser] = useState<{
    id:number
    email:string
  }|null>(null)
  async function getAuth(){
    const token = window.localStorage.getItem('token')
    try {
      const res = await API("/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)
      if(res.status===200){
        const user = {
          id:1,
          email:'narenmagarz98@gmail.com'
        }
        setUser(user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    }
    finally{
      
    }

  }
  const logout = ()=>{
    setUser(null)
    window.location.href = '/signin'
    // navigate('/',{replace:true})
  }
  useEffect(()=>{
    getAuth()
  },[])
  return (
    <AuthContext.Provider value={user? {...user,logout}:null} >
      {children}
    </AuthContext.Provider>
  )
}



export const useAuth = ()=>{
  return useContext(AuthContext)
}