"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthProviders from "../authproviders";
import Image from 'next/image'
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';

const dmsans = DM_Sans({
  subsets:["latin"],
  variable: "--font-dmsans",
})

interface CredentialsFormProps {
  csrfToken?: string;
}

export default function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async () => {
  };
  return (
    
    <div className="w-full flex flex-col items-center min-h-screen">
      <Link href="/" className="flex place-self-start ml-16 my-5">
          <Image
            src="/logo.svg"
            alt="Jelp logo"
            width="100"
            height="100"
            className="object-contain"
          />

      </Link>
      <div className="flex flex-col items-center w-1/3">
        <h1 className="mt-10 mb-5 text-base font-bold text-[#AD343E] cursor-default">Welcome back! <span className="text-black">Log in Jelp</span></h1>

        <form className="w-full text-xl text-black font-semibold flex flex-col" onSubmit={handleSubmit}>
          {error && (
            <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {error}
            </span>
          )}
          <div className='flex items-center mb-5'>
            <div className='absolute m-5 flex'>
              <Image src="/2User.svg" alt="Email" width={20} height={20} />
              <div className="h-10 bg-black w-px ml-5"></div>
            </div>
            <input type='email' name='email' placeholder='Email or account' required className='w-full pl-20 py-4 bg-[#D9D9D9] text-black text-opacity-50 lg:text-base md:text-sm sm:text-xs font-dmsans rounded-lg placeholder-black placeholder-opacity-50' />
          </div>
          <div className='relative items-center place-content-center'>
            <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' required className='w-full pl-20 py-4 bg-[#D9D9D9] text-black text-opacity-50 text-base font-dmsans rounded-lg placeholder-black placeholder-opacity-50 focus:outline' />

            <div className='absolute flex w-11 h-1/2 -top-1 my-5 mx-3 bg-blend-overlay bg-[#D9D9D9] -right-3 justify-center'>
              {showPassword ? <button type='button' onClick={togglePasswordVisibility}>
                <Image src="/hide.svg" alt="Show" width={20} height={20} /> </button> :
                <button type='button' onClick={togglePasswordVisibility} >
                  <Image src="/show.svg" alt="Show" width={20} height={20} /> </button>
              }
            </div>

            <div className='absolute mx-5 my-2 flex top-0'>
              <Image src="/iconPassword.svg" alt="Password" width={20} height={20} />
              <div className="h-10 bg-black w-px ml-5" />
            </div>
          </div>
          <button className='text-base text-black text-opacity-50 font-dmsans ml-auto w-fit my-3 hover:underline underline-offset-2'>Forgot password</button>
          <button type='submit' className="w-full h-12 px-6 text-base font-dmsans text-white bg-[#13544E] rounded-lg focus:shadow-outline">
            Log in
          </button>
          <div className="h-px bg-black w-full my-7" />
          <AuthProviders />
        </form>
        <h1 className="mt-5 text-base font-bold text-[#AD343E] cursor-default">New member? <span className="text-black text-opacity-50 hover:underline underline-offset-2 cursor-pointer">Create account here</span></h1>
      </div>
    </div>
  );
}