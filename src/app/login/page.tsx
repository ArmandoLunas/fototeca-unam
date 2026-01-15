'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useSearchParams();
  const router = useRouter();

  const callbackUrlParam = params.get('callbackUrl');
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith('/')
      ? callbackUrlParam
      : '/admin';

  useEffect(() => {
    const err = params.get('error');
    if (err) setError('No pudimos iniciar sesión. Revisa tus credenciales.');
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) router.push(callbackUrl);
    else setError(res?.error || 'Credenciales inválidas');
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/fondo.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* HEADER LOGIN  */}
      <header className="w-full bg-[#E03A3E]/90 text-white py-4 shadow-md">
  <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
    
    <div className="flex items-center gap-3">
      <Image
        src="/identidadesc.png"
        alt="Logo Fototeca UNAM"
        width={220}
        height={120}
        className="rounded"
        priority
      />
    </div>

    <span className="text-sm font-medium">
      Panel de administración
    </span>

  </div>
</header>


      {/* CONTENIDO */}
      <main className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur border p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-1 text-slate-900">
            Iniciar sesión
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Ingresa tus credenciales institucionales.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <label className="block text-sm mb-1 text-slate-700">
            Email
          </label>
          <input
            className="w-full border text-slate-800 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            type="email"
            value={email}
            placeholder="usuario@unam.mx"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <label className="block text-sm mb-1 text-slate-700">
            Password
          </label>
          <input
            className="w-full border text-slate-800 rounded-md px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 hover:bg-slate-800 text-white py-2 text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>

          <p className="text-center text-sm mt-3">
            ¿No tienes cuenta?
            <a
              href="/register"
              className="text-blue-700 underline ml-1"
            >
              Crear cuenta
            </a>
          </p>
        </form>
      </main>

      {/* FOOTER COMPACTO SOLO PARA LOGIN */}
      <div className="py-3">
        <Footer />
      </div>
    </div>
  );
}
