export async function onRequest(context) {

    const cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };


    // Cho phép kiểm tra kết nối
    if (context.request.method === "OPTIONS") {

        return new Response(null, {
            headers: cors
        });

    }



    // Test API
    if (context.request.method !== "POST") {

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


        const body =
            await context.request.json();


        const text =
            body.text || "";



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



        // Tạm thời tạo SRT demo
        // Sau này thay bằng Whisper + AI thật

        const srt =
`1
00:00:00,000 --> 00:00:05,000
${text}


2
00:00:05,000 --> 00:00:10,000
GenSubAI đang tạo phụ đề.
`;



        return new Response(

            JSON.stringify({

                success:true,

                translated:text,

                srt:srt

            }),

            {
                headers:{
                    ...cors,
                    "Content-Type":"application/json"
                }
            }

        );



    } catch(error) {


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
