"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            La Cañada
          </h1>
          <span className="text-xs text-gray-500 sm:text-sm">
            Joaquín Castro
          </span>
        </div>

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
    </header>
  )
}
