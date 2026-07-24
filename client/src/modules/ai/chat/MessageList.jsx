import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const MessageList = ({ messages, isTyping }) => {


    const bottomRef = useRef(null);



    // Auto scroll
    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, isTyping]);




    return (
        <div
            className="
        p-6
        space-y-6
        max-w-5xl
        mx-auto
      "
        >


            {messages.map((message, index) => (


                message.role === "ai" ? (


                    // AI Message
                    <div
                        key={index}
                        className="
              flex
              gap-4
              items-start
            "
                    >


                        {/* AI Avatar */}
                        <div
                            className="
                w-10
                h-10
                rounded-full
                bg-blue-600
                flex
                items-center
                justify-center
                text-white
              "
                        >
                            🤖
                        </div>



                        {/* AI Content */}
                        <div
                            className="
                max-w-3xl
                bg-slate-800
                border
                border-slate-700
                text-slate-200
                px-5
                py-4
                rounded-2xl
              "
                        >

                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.text}
                                </ReactMarkdown>
                            </div>


                        </div>


                    </div>



                ) : (



                    // User Message
                    <div
                        key={index}
                        className="
              flex
              justify-end
              gap-4
              items-start
            "
                    >



                        <div
                            className="
                max-w-3xl
                bg-blue-600
                text-white
                px-5
                py-4
                rounded-2xl
              "
                        >
                            {message.text}
                        </div>



                        {/* User Avatar */}
                        <div
                            className="
                w-10
                h-10
                rounded-full
                bg-slate-700
                flex
                items-center
                justify-center
                text-white
              "
                        >
                            👤
                        </div>



                    </div>


                )


            ))}





            {/* Typing Indicator */}
            {isTyping && (

                <div
                    className="
            flex
            gap-4
            items-start
          "
                >


                    <div
                        className="
              w-10
              h-10
              rounded-full
              bg-blue-600
              flex
              items-center
              justify-center
              text-white
            "
                    >
                        🤖
                    </div>



                    <div
                        className="
              bg-slate-800
              border
              border-slate-700
              px-5
              py-4
              rounded-2xl
              text-slate-400
            "
                    >
                        NovaAI is thinking...
                    </div>



                </div>

            )}




            {/* Auto Scroll Target */}
            <div ref={bottomRef} />


        </div>
    );
};


export default MessageList;