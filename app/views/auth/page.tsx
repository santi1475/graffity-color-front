"use client"

import type React from "react"
import { useState } from "react"
import { UserIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { loginSchema } from "@/app/lib/login"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import {AxiosError, AxiosResponse } from "axios"
import httpClient from "@/app/helpers/http-client"

type LoginFormData = z.infer<typeof loginSchema>

interface ResponseLogin {
    access_token: string
    user: {
        id: string
        email: string
        name?: string
    }
}

interface ErrorResponse {
    error?: string
    message?: string
}

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectedFrom = searchParams.get('redirectedFrom')
    
    const [isHovering, setIsHovering] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "jaico3456789@gmail.com",
            password: "12345678",
        },
    })

    const redirectUser = () => {
        if (redirectedFrom) {
            router.push(redirectedFrom)
        } else {
            router.push("/")
        }
    }

    const onSubmit = async (data: LoginFormData) => {
        setLoginError(null)
        
        try {
            const res: AxiosResponse<ResponseLogin> = await httpClient.post(
                "/auth/login", 
                data
            )
            
            console.log(res)
            
            if (res.data.access_token) {
                localStorage.setItem('token', res.data.access_token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                redirectUser()
            }
        } catch (error) {
            console.log(error)
            
            if (error instanceof AxiosError) {
                const errorData = error.response?.data as ErrorResponse | undefined
                
                if (errorData?.error && !loginError) {
                    setLoginError(errorData.error)
                } else if (errorData?.message && !loginError) {
                    setLoginError(errorData.message)
                }
            }
        }
    }

    return (
        <div className="flex h-screen w-screen">
            {/* Left Panel - Light Gray */}
            <div className="w-1/2 bg-[#D9D9D9]" />

            {/* Right Panel - White with Form */}
            <div className="w-1/2 bg-white flex items-center justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-6 w-full max-w-xs">
                    {/* User Icon */}
                    <div className="flex justify-center">
                        <UserIcon size={70} className="text-[#C4300B]" strokeWidth={1.5} />
                    </div>

                    {/* Email Field */}
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder=""
                            className="w-full h-10 px-6 bg-[#F2F2F2] text-black placeholder-gray-400 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#C4300B] focus:ring-offset-0"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder=""
                            className="w-full h-10 px-6 bg-[#F2F2F2] text-black placeholder-gray-400 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#C4300B] focus:ring-offset-0"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">{errors.password.message}</span>
                        )}
                    </div>

                    {/* --- MOSTRAR ERROR DE LOGIN AQUÍ --- */}
                    {loginError && (
                        <span className="text-red-500 text-sm text-center">{loginError}</span>
                    )}

                    {/* --- BOTÓN ACTUALIZADO --- */}
                    <button
                        type="submit"
                        disabled={isSubmitting} // Deshabilitar si se está enviando
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className={`mt-4 px-6 py-2 rounded-full border border-[#C4300B] font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isHovering && !isSubmitting ? "bg-[#C4300B] text-white" : "bg-white text-black border-[#C4300B]"
                            }`}
                    >
                        {isSubmitting ? "Accediendo..." : "Acceder"}
                    </button>

                    {/* Info Text */}
                    <p className="font-italic text-xs text-black text-center mt-2 leading-relaxed max-w-xs">
                        Si no posee una cuenta, solicite al Administrador generarle una
                    </p>
                </form>
            </div>
        </div>
    )
}