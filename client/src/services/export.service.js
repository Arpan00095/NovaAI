import jsPDF from "jspdf";

export const exportChatAsMarkdown = (messages = []) => {
  let content = "# NovaAI Conversation\n\n";

  messages.forEach((message) => {
    const role =
      message.role === "user"
        ? "User"
        : "NovaAI";

    content += `## ${role}\n\n`;

    if (message.image) {
      content += `![Generated Image](${message.image})\n\n`;
    }

    if (message.content) {
      content += `${message.content}\n\n`;
    }

    content += "---\n\n";
  });

  const blob = new Blob([content], {
    type: "text/markdown",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = `NovaAI-${Date.now()}.md`;

  a.click();

  URL.revokeObjectURL(url);
};

export const exportChatAsPdf = (messages = []) => {
  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(18);
  pdf.text("NovaAI Conversation", 15, y);

  y += 15;

  messages.forEach((message) => {
    const role =
      message.role === "user"
        ? "User"
        : "NovaAI";

    pdf.setFontSize(12);

    pdf.setFont(undefined, "bold");
    pdf.text(role, 15, y);

    y += 7;

    pdf.setFont(undefined, "normal");

    const text =
      message.image
        ? `Image: ${message.image}`
        : message.content || "";

    const lines = pdf.splitTextToSize(
      text,
      180
    );

    pdf.text(lines, 15, y);

    y +=
      lines.length * 7 + 10;

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }
  });

  pdf.save(`NovaAI-${Date.now()}.pdf`);
};