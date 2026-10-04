import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#232C38] bg-gray-900">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center font-extrabold text-sm md:text-lg">
              <span className="text-white">SELL</span>
              <span className="text-green-500">IO</span>
            </Link>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#7E8CA0]">
              Everything you need, one click away.
            </p>
          </div>

          {/* Page links */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">
              Page
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Products / Shop
                </Link>
              </li>
              <li>
                <Link href="/discount" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Discount / Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">
              Customer Service
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/track-order" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Links */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">
              Category
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/category/all" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Men / Women / Kids
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/new" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category/best-sellers" className="font-mono text-xs text-[#7E8CA0] transition duration-300 hover:text-green-500">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <p className="mb-3 text-sm font-semibold text-white">
              Contact
            </p>
            <ul className="flex flex-col gap-2 font-mono text-xs text-[#7E8CA0]">
              <li>Dhaka, Bangladesh</li>
              <li>
                <a href="tel:+8800000000" className="transition duration-300 hover:text-green-500">
                  +880 00 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:support@sellio.com" className="transition duration-300 hover:text-green-500">
                  support@sellio.com
                </a>
              </li>
              <li className="leading-relaxed">9 AM – 10 PM, everyday</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#232C38]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-4 text-center sm:flex-row sm:justify-between sm:px-6">
          <p className="font-mono text-[11px] text-[#7E8CA0]">
            © {year} SELLIO. All rights reserved.
          </p>
          <div className="flex items-center gap-1 font-extrabold text-sm">
            <span className="text-white">SELL</span>
            <span className="text-green-500">IO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}