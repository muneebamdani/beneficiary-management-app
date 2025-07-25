import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700 w-full">Go to Dashboard</Button>
          </Link>

          <Link to="/login">
            <Button variant="outline" className="w-full bg-transparent">
              Sign In with Different Account
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need Help?</strong> Contact your system administrator or try logging in with the correct role
            permissions.
          </p>
        </div>
      </div>
    </div>
  )
}
