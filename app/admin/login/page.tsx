'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050f2c] via-[#0a1f4f] to-[#1a3a8f] p-6">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div
              className="w-14 h-16 bg-[#e30613] flex items-center justify-center text-white font-black text-sm relative"
              style={{ clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)' }}
            >
              <span className="relative z-10">PEC</span>
              <div
                className="absolute inset-1 bg-[#0a1f4f]"
                style={{ clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)' }}
              ></div>
              <span className="relative z-10">PEC</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            PAINEL ADMINISTRATIVO
          </h1>
          <p className="text-sm text-slate-300 mt-2 tracking-widest uppercase">
            Piauí Esporte Clube
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#e30613] focus:bg-white/15 transition-colors rounded"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#e30613] focus:bg-white/15 transition-colors rounded"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-200 text-sm p-3 rounded">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e30613] hover:bg-[#a8000a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded transition-colors tracking-wider uppercase text-sm shadow-lg shadow-red-500/20"
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 tracking-wider">
          © 2026 PIAUÍ ESPORTE CLUBE
        </p>
      </div>
    </main>
  )
}