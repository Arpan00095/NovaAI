import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">


      {/* Hero Section */}
      <section
        className="
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
        "
      >

        <div
          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2
            rounded-full
            bg-blue-500/10
            text-blue-400
            font-medium
            mb-6
          "
        >
          🚀 AI Powered Productivity Platform
        </div>


        <h1
          className="
            text-6xl
            md:text-7xl
            font-bold
            text-white
          "
        >
          NovaAI 🤖
        </h1>


        <h2
          className="
            mt-6
            text-3xl
            md:text-5xl
            font-bold
            text-slate-200
          "
        >
          One Platform.
          <br />
          All AI Tools.
        </h2>


        <p
          className="
            mt-6
            max-w-3xl
            text-lg
            text-slate-400
          "
        >
          Create content, generate images, build resumes,
          analyze documents and chat with AI —
          everything in one powerful workspace.
        </p>


        <div className="mt-10 flex gap-4">


          <Link
            to="/ai"
            className="
              px-8
              py-4
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              shadow-lg
              transition
            "
          >
            Start Chatting 🚀
          </Link>


          <Link
            to="/library"
            className="
              px-8
              py-4
              rounded-2xl
              border
              border-slate-700
              text-slate-200
              font-semibold
              hover:bg-slate-800
              transition
            "
          >
            Explore AI Tools
          </Link>


        </div>


      </section>



      {/* AI Tools Section */}
      <section
        className="
          px-6
          py-20
          bg-slate-900
        "
      >


        <h2
          className="
            text-4xl
            font-bold
            text-center
            text-white
          "
        >
          Powerful AI Tools
        </h2>



        <div
          className="
            max-w-6xl
            mx-auto
            mt-12
            grid
            md:grid-cols-3
            gap-8
          "
        >


          {[
            {
              icon: "📝",
              title: "AI Resume Builder",
              desc: "Create professional resumes with AI."
            },
            {
              icon: "💬",
              title: "AI Assistant",
              desc: "Chat with intelligent AI models."
            },
            {
              icon: "🎨",
              title: "AI Image Generator",
              desc: "Generate creative images instantly."
            }
          ].map((tool, index) => (

            <div
              key={index}
              className="
                bg-slate-800
                rounded-3xl
                p-8
                border
                border-slate-700
                hover:border-blue-500
                hover:shadow-xl
                transition
              "
            >

              <div className="text-4xl">
                {tool.icon}
              </div>


              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-white
                "
              >
                {tool.title}
              </h3>


              <p
                className="
                  mt-3
                  text-slate-400
                "
              >
                {tool.desc}
              </p>


            </div>

          ))}


        </div>


      </section>


    </div>
  );
};

export default Home;