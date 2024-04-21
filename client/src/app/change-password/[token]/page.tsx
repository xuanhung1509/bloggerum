'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuthContext } from '~/app/context/AuthContext'

type Inputs = {
    password: string
    confirmPassword: string
}

const ChangePassword = ({
    params: { token },
}: {
    params: { token: string }
}) => {
    const router = useRouter()
    const { setUser } = useAuthContext()
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch(
            'http://localhost:8080/api/users/change-password',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    password: formData.password,
                    token,
                }),
                credentials: 'include',
            }
        )

        if (!res.ok) {
            throw new Error('Server error')
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        toast.success('Password updated!')
        router.push('/')
    })

    return (
        <div className="container mx-auto max-w-md lg:min-w-[28rem]">
            <h1 className="text-center text-3xl font-bold">Change password</h1>
            <p className="mt-2 text-center text-sm text-gray-500">
                Enter your new password
            </p>
            <form className="mt-8" onSubmit={onSubmit}>
                <div>
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                    >
                        New password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="New password"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('password', {
                            required: 'Password is required',
                        })}
                    />
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
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => {
                                if (value !== watch('password'))
                                    return 'Your password do not match'
                            },
                        })}
                    />
                    {errors.confirmPassword && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full rounded bg-black px-8 py-3 font-semibold text-white"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
