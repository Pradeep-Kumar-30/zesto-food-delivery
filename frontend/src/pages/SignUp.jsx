import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate=useNavigate()
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [mobile,setMobile]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
     const handleSignUp=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signup`,{
                fullName,email,password,mobile,role
            },{withCredentials:true})
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
             setLoading(false)
        }
     }

     const handleGoogleAuth=async () => {
        if(!mobile){
          return setErr("mobile no is required")
        }
        const provider=new GoogleAuthProvider()
        const result=await signInWithPopup(auth,provider)
  try {
    const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile
    },{withCredentials:true})
   dispatch(setUserData(data))
  } catch (error) {
    console.log(error)
  }
     }
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50'>
            <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Left Side - Form */}
                <div className='bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-100 flex flex-col justify-center hover:shadow-xl transition'>
                    <h1 className='text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3'>zesto</h1>
                    <p className='text-gray-600 mb-8 text-lg'> Create your account to get started with delicious food deliveries
                    </p>

                    {/* fullName */}

                    <div className='mb-6'>
                        <label htmlFor="fullName" className='block text-gray-800 font-bold mb-2'>Full Name</label>
                        <input type="text" className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition' placeholder='Enter your Full Name' onChange={(e)=>setFullName(e.target.value)} value={fullName} required/>
                    </div>
                    {/* email */}

                    <div className='mb-6'>
                        <label htmlFor="email" className='block text-gray-800 font-bold mb-2'>Email</label>
                        <input type="email" className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                    </div>
                    {/* mobile*/}

                    <div className='mb-6'>
                        <label htmlFor="mobile" className='block text-gray-800 font-bold mb-2'>Mobile</label>
                        <input type="tel" className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition' placeholder='Enter your Mobile Number' onChange={(e)=>setMobile(e.target.value)} value={mobile} required/>
                    </div>
                    {/* password*/}

                    <div className='mb-6'>
                        <label htmlFor="password" className='block text-gray-800 font-bold mb-2'>Password</label>
                        <div className='relative'>
                            <input type={`${showPassword ? "text" : "password"}`} className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition pr-12' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                            <button className='absolute right-4 cursor-pointer top-[18px] text-orange-600 text-xl' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                        </div>
                    </div>
                    {/* role*/}

                    <div className='mb-6'>
                        <label htmlFor="role" className='block text-gray-800 font-bold mb-3'>Select Your Role</label>
                        <div className='flex gap-2'>
                            {["user", "owner", "deliveryBoy"].map((r) => (
                                <button
                                    className='flex-1 border-2 rounded-2xl px-3 py-2 text-center font-bold transition-all cursor-pointer hover:scale-105'
                                    onClick={()=>setRole(r)}
                                    style={
                                       role==r?
                                       {backgroundColor:"#ff5722",color:"white",borderColor:"#ff5722"}
                                       :{borderColor:"#ffa726",color:"#ff6f00"}
                                    }>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                <button className='w-full font-bold py-3 rounded-full transition duration-200 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105 cursor-pointer text-lg' onClick={handleSignUp} disabled={loading}>
                    {loading?<ClipLoader size={20} color='white'/>:"Sign Up"}
                
                </button>
                {err && <p className='text-red-500 text-center my-[10px] font-semibold'>*{err}</p>}
                

                <button className='w-full mt-4 flex items-center justify-center gap-2 border-2 border-orange-300 rounded-full px-4 py-3 transition cursor-pointer duration-200 hover:bg-orange-50 font-semibold' onClick={handleGoogleAuth}>
    <FcGoogle size={22}/>
    <span>Sign up with Google</span>
                </button>
                <p className='text-center mt-8 text-gray-700' onClick={()=>navigate("/signin")}>Already have an account?  <span className='bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold cursor-pointer hover:scale-105 transition inline-block'>Sign In</span></p>
                </div>

                {/* Right Side - About Zesto */}
                <div className='hidden md:flex flex-col justify-center'>
                    <div className='bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-2xl p-12 text-white'>
                        <h2 className='text-4xl font-black mb-6'>Join Zesto!</h2>
                        
                        <div className='space-y-6 text-lg'>
                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>👨‍🍳</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>For Customers</h3>
                                    <p className='opacity-90'>Access thousands of restaurants and enjoy fast, reliable food delivery with great discounts.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>🏪</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>For Owners</h3>
                                    <p className='opacity-90'>Expand your restaurant business and reach more customers through our digital platform.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>🛵</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>For Delivery Partners</h3>
                                    <p className='opacity-90'>Earn on your own schedule. Be your own boss and deliver food to hungry customers.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>⭐</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>Safe & Secure</h3>
                                    <p className='opacity-90'>All transactions are encrypted and protected. Your privacy is our top priority.</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 pt-8 border-t border-white/30'>
                            <p className='text-sm opacity-80'>Join our community and experience food delivery like never before!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
