import { Link } from "react-router-dom";


const Navbar = () => {




    return (
        <nav
            className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-white/80
        dark:bg-black/80
        backdrop-blur-md
        border-b
        border-slate-200
        dark:border-slate-800
        transition
      "
        >

            <div
                className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
        "
            >


                {/* Logo */}
                <Link
                    to="/"
                    className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white
          "
                >
                    NovaAI 🤖
                </Link>



                {/* Navigation */}
                <div className="hidden md:flex items-center gap-8">

                    <Link
                        to="/"
                        className="
              text-slate-700
              dark:text-slate-300
              hover:text-blue-600
              transition
            "
                    >
                        Home
                    </Link>


                    <Link
                        to="/ai"
                        className="
              text-slate-700
              dark:text-slate-300
              hover:text-blue-600
              transition
            "
                    >
                        AI Workspace
                    </Link>


                    <Link
                        to="/library"
                        className="
              text-slate-700
              dark:text-slate-300
              hover:text-blue-600
              transition
            "
                    >
                        Library
                    </Link>

                </div>



                {/* Right Side */}
                <div className="flex items-center gap-3">





                    {/* Login */}
                    <Link
                        to="/login"
                        className="
              px-4
              py-2
              rounded-xl
              text-slate-700
              dark:text-white
              hover:bg-slate-100
              dark:hover:bg-slate-900
              transition
            "
                    >
                        Login
                    </Link>



                    {/* Signup */}
                    <Link
                        to="/signup"
                        className="
              px-5
              py-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              transition
            "
                    >
                        Sign Up
                    </Link>


                </div>


            </div>

        </nav>
    );
};


export default Navbar;