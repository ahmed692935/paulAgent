import { Link } from "react-router-dom"

function success() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* <h3>Success </h3> */}
            <Link to="/dashboard"
                className="w-full max-w-2xs flex items-center justify-center gap-2 bg-[#13243C] hover:opacity-90 text-white py-4 rounded-lg transition-all cursor-pointer"
            >
                Go To Dashboard
            </Link>
        </div>
    )
}

export default success
