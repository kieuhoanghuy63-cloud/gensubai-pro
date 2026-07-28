export default {
  async fetch(request) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    };


    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors
      });
    }


    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "GenSubAI API Running"
        }),
        {
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }


    try {

      const data = await request.json();


      const text = data.text || "";


      if (!text) {

        return new Response(
          JSON.stringify({
            success:false,
            error:"Không có nội dung"
          }),
          {
            headers:{
              ...cors,
              "Content-Type":"application/json"
            }
          }
        );

      }



      // Demo AI dịch
      // Sau này thay bằng Gemini/Whisper

      const translated = `
1
00:00:00,000 --> 00:00:05,000
${text}


2
00:00:05,000 --> 00:00:10,000
GenSubAI đang tạo phụ đề.
`;



      return new Response(
        JSON.stringify({

          success:true,

          srt:translated,

          translated:text

        }),
        {
          headers:{
            ...cors,
            "Content-Type":"application/json"
          }
        }
      );


    } catch(error){


      return new Response(
        JSON.stringify({

          success:false,

          error:error.message

        }),
        {
          status:500,
          headers:{
            ...cors,
            "Content-Type":"application/json"
          }
        }
      );

    }


  }
}
