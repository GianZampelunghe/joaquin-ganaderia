"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookMarked } from "lucide-react"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState(new Date())
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Mis Animales", href: "/animales" },
    { name: "+ Cargar Animal", href: "/animales/nueva" },
    { name: "Cuentas", href: "/cuentas" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group active:scale-[0.98] transition-transform duration-150">
          <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
            <BookMarked className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl leading-none mb-1">
              La Cañada
            </h1>
            <span className="text-xs text-gray-500 sm:text-sm leading-none">
              Joaquín Castro
            </span>
          </div>
        </Link>

        {mounted ? (
          <div className="flex flex-col items-end text-sm text-gray-700">
            <span className="font-medium capitalize">
              {format(date, "EEEE, dd/MM/yyyy", { locale: es })}
            </span>
            <span>{format(date, "HH:mm:ss")}</span>
          </div>
        ) : (
          <div className="h-10 w-24 animate-pulse rounded bg-gray-100" />
        )}
      </div>

      <div className="border-t bg-gray-50/50">
        <div className="container px-4 sm:px-6">
          <nav className="flex overflow-x-auto whitespace-nowrap no-scrollbar py-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98] duration-150 flex-shrink-0 ${
                  pathname === link.href
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
