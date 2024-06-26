'use client'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { useAuthContext } from '../context/AuthContext'

type Inputs = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const Register = () => {
    const router = useRouter()
    const { user, setUser } = useAuthContext()
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            }
        )

        if (res.status === 400) {
            toast.error('User already exists')
            return
        }

        const user = await res.json()
        setUser(user)
        router.replace('/')
    })

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [router, user])

    return (
        <div className="container mx-auto max-w-md lg:min-w-[28rem]">
            <h1 className="text-center text-3xl font-bold">
                Create an account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500">
                A few steps towards great things.
            </p>

            <form className="mt-8" onSubmit={onSubmit}>
                <div>
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Your username"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('name', {
                            required: 'Username is required',
                        })}
                    />
                    {errors.name && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Your email"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please provide a valid email',
                            },
                        })}
                    />
                    {errors.email && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="mt-2 flex items-center rounded border shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green-600">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            placeholder="Your password"
                            className="flex-1 px-4 py-2 focus:outline-none"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                        />
                        <button
                            type="button"
                            className="rounded px-4 py-2 focus:outline-green-600"
                            onClick={() =>
                                setIsPasswordVisible((prev) => !prev)
                            }
                        >
                            {isPasswordVisible ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeSlashIcon className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700"
                    >
                        Confirm password
                    </label>
                    <div className="mt-2 flex items-center rounded border shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green-600">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm password"
                            className="flex-1 px-4 py-2 focus:outline-none"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => {
                                    if (value !== watch('password'))
                                        return 'Your password do not match'
                                },
                            })}
                        />
                        <button
                            type="button"
                            className="rounded px-4 py-2 focus:outline-green-600"
                            onClick={() =>
                                setIsPasswordVisible((prev) => !prev)
                            }
                        >
                            {isPasswordVisible ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeSlashIcon className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded bg-black px-8 py-3 font-semibold text-white"
                    >
                        {isSubmitting && <Spinner size="sm" color="white" />}
                        Register
                    </button>
                </div>
                <div className="mt-8">
                    <div className="flex items-center justify-center gap-2">
                        <p>Already a member?</p>
                        <Link
                            href="/login"
                            className="text-green-600 underline"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
