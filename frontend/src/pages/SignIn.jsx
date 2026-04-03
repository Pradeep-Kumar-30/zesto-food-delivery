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
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
     const handleSignIn=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
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
             const provider=new GoogleAuthProvider()
             const result=await signInWithPopup(auth,provider)
       try {
         const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
             email:result.user.email,
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
                    <p className='text-gray-600 mb-8 text-lg'> Sign In to your account to get started with delicious food deliveries
                    </p>

                  
                    {/* email */}

                    <div className='mb-6'>
                        <label htmlFor="email" className='block text-gray-800 font-bold mb-2'>Email</label>
                        <input type="email" className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                    </div>
                    {/* password*/}

                    <div className='mb-2'>
                        <label htmlFor="password" className='block text-gray-800 font-bold mb-2'>Password</label>
                        <div className='relative'>
                            <input type={`${showPassword ? "text" : "password"}`} className='w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition pr-12' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                            <button className='absolute right-4 cursor-pointer top-[18px] text-orange-600 text-xl' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                        </div>
                    </div>
                    <div className='text-right mb-6 cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold hover:scale-105 transition' onClick={()=>navigate("/forgot-password")}>
                      Forgot Password?
                    </div>
                

                <button className='w-full font-bold py-3 rounded-full transition duration-200 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-105 cursor-pointer text-lg' onClick={handleSignIn} disabled={loading}>
                    {loading?<ClipLoader size={20} color='white'/>:"Sign In"}
                </button>
          {err && <p className='text-red-500 text-center my-[10px] font-semibold'>*{err}</p>}

                <button className='w-full mt-4 flex items-center justify-center gap-2 border-2 border-orange-300 rounded-full px-4 py-3 transition cursor-pointer duration-200 hover:bg-orange-50 font-semibold' onClick={handleGoogleAuth}>
    <FcGoogle size={22}/>
    <span>Sign In with Google</span>
                </button>
                <p className='text-center mt-8 text-gray-700' onClick={()=>navigate("/signup")}>Want to create a new account?  <span className='bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold cursor-pointer hover:scale-105 transition inline-block'>Sign Up</span></p>
                </div>

                {/* Right Side - About Zesto */}
                <div className='hidden md:flex flex-col justify-center'>
                    <div className='bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-2xl p-12 text-white'>
                        <h2 className='text-4xl font-black mb-6'>About Zesto</h2>
                        
                        <div className='space-y-6 text-lg'>
                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>🍔</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>Fresh & Delicious</h3>
                                    <p className='opacity-90'>Experience the finest food from your favorite restaurants, delivered fresh to your doorstep.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>⚡</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>Super Fast Delivery</h3>
                                    <p className='opacity-90'>Get your orders delivered in just 30 minutes or less. We prioritize speed without compromising quality.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>💰</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>Best Prices</h3>
                                    <p className='opacity-90'>Enjoy amazing discounts and exclusive offers available only for our registered members.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='text-4xl'>🔒</div>
                                <div>
                                    <h3 className='font-bold mb-2 text-xl'>Secure & Safe</h3>
                                    <p className='opacity-90'>Your data is encrypted and protected. We ensure safe transactions and reliable service.</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 pt-8 border-t border-white/30'>
                            <p className='text-sm opacity-80'>Join thousands of happy customers enjoying food delivery with Zesto!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
