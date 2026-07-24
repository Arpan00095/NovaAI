// NovaAI AI Service Layer

export const generateAIResponse = async (message) => {

  try {

    return {
      success: true,
      response: `NovaAI received: ${message} 🚀`
    };


  } catch (error) {

    console.error("AI Service Error:", error);


    return {
      success: false,
      response: "Something went wrong with AI service."
    };

  }

};