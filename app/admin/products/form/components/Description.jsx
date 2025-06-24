"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

export default function Description({ data, handleData }) {
  const [content, setContent] = useState(data?.description || "");

  const handleEditorChange = (content, editor) => {
    setContent(content);
    handleData("description", content); // Pass content back to parent
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl overflow-y-auto max-h-[500px]">
      <h1 className="font-semibold">Description</h1>

      <Editor
        apiKey="de1qnloldjo8ek8emia7kwdaerc863qyxbe98vvi2q62u49j" // Optional: You can get an API key from TinyMCE
        value={content}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "textcolor", // Plugin for text color
            "colorpicker", // For color picker button
            "emoticons",  // Optional emoticons plugin
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | emoticons | removeformat | code | help", // Updated toolbar
          content_style:
            "body { font-family: Arial, sans-serif; font-size: 14px; }", // Optional: Set default font and size
        }}
        onEditorChange={handleEditorChange}
      />
    </section>
  );
}
