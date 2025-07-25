import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { BeneficiaryProvider } from "@/contexts/BeneficiaryContext"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Saylani Welfare - Beneficiary Management",
  description: "Beneficiary Management System for Saylani Welfare",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BeneficiaryProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>{children}</main>
            </div>
          </BeneficiaryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
