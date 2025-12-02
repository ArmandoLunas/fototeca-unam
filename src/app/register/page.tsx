'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      setError(data.error || "No se pudo crear la cuenta");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={onSubmit} className="max-w-sm w-full space-y-4 bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl text-neutral-900 font-semibold">Crear cuenta</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="text-sm text-neutral-600 font-medium">Nombre</label>
          <input className="w-full text-neutral-700 border rounded px-3 py-2" 
            value={name} onChange={(e)=>setName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-neutral-600 font-medium">Correo</label>
          <input className="w-full text-neutral-700 border rounded px-3 py-2"
            type="email" value={email}
            onChange={(e)=>setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm text-neutral-600 font-medium">Contraseña</label>
          <input
            className="w-full text-neutral-700 border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-neutral-500">Mínimo 6 caracteres</p>
        </div>

        <button disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800">
          {loading ? "Creando cuenta..." : "Registrar"}
        </button>

        <p className="text-sm text-neutral-800 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-neutral-800 underline">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
