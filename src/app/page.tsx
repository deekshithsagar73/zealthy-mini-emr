'use client'

import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-xl border border-gray-300">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Zealthy</h1>
          <h2 className="mt-2 text-lg text-gray-600">Patient Portal Login</h2>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="mark@some-email-provider.net"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                placeholder="Password123!"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm text-center">{state.error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="text-center text-sm text-gray-500">
          <p>Admin access? <a href="/admin" className="font-medium text-green-600 hover:text-green-500">Go to EMR</a></p>
        </div>
      </div>
    </div>
  )
}
