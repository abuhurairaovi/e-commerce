'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const LINKS = [
  { label: 'home', href: '/' },
  { label: 'about', href: '/about' },
  { label: 'discount', href: '/discount' },
  { label: 'products', href: '/products' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      <div className='sticky top-0 z-50 relative flex w-full items-center justify-between px-5 py-5 bg-gray-900'>

        <nav className='hidden items-center gap-6 sm:flex'>

          <Link
            href='/'
            className='flex items-center font-extrabold text-sm md:text-lg'
          >
            <span className='text-white'>SELL</span>
            <span className='text-green-500'>IO</span>
          </Link>

          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-white hover:text-green-600'
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href='/my-orders'
              className='text-white hover:text-green-600'
            >
              my orders
            </Link>
          )}

        </nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label="menu open"
          className="flex flex-col gap-1.5 sm:hidden"
        >
          <span className={`h-[1.5px] w-5 bg-[#E6EDF3] transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-5 bg-[#E6EDF3] transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`h-[1.5px] w-5 bg-[#E6EDF3] transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>

        <div className='hidden items-center rounded-2xl border-b-2 border-b-indigo-950 md:flex'>
          <input
            type='text'
            placeholder='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className='w-48 md:w-56 px-3 py-2.5 outline-none'
          />
        </div>

        {user ? (
          <div className='hidden items-center gap-3 md:flex'>
            <span className='text-white text-sm'>
              👤 {user.user_metadata?.full_name || user.email.split('@')[0]}
            </span>

            <button
              onClick={logout}
              className='rounded-2xl bg-blue-300 px-4 py-2 hover:bg-black hover:text-white transition duration-300'
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link
            href='/login'
            className='hidden items-center rounded-2xl bg-blue-300 px-4 py-2 hover:bg-black transition duration-300 md:flex'
          >
            LOGIN
          </Link>
        )}

      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-700 bg-gray-900 px-5 py-4 sm:hidden">

          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-gray-300 transition duration-300 hover:bg-gray-800 hover:text-green-400"
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <Link
              href="/my-orders"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-gray-300 transition duration-300 hover:bg-gray-800 hover:text-green-400"
            >
              my orders
            </Link>
          )}

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="mt-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white outline-none placeholder:text-gray-500"
          />

          {user ? (
            <div className="mt-3 flex flex-col gap-2">
              <span className="text-gray-300 text-sm px-3">
                👤 {user.user_metadata?.full_name || user.email.split('@')[0]}
              </span>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block rounded-lg bg-blue-300 px-4 py-2.5 text-center font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-lg bg-blue-300 px-4 py-2.5 text-center font-semibold text-black transition duration-300 hover:bg-black hover:text-white"
            >
              LOGIN
            </Link>
          )}

        </nav>
      )}
    </>
  )
}