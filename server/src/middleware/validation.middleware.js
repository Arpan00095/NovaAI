export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  if (typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message must be a string",
    });
  }

  if (message.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Message is too short",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Message is too long",
    });
  }

  next();
};