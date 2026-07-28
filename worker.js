export default {
  async fetch(request) {

    if (request.method === "OPTIONS") {
      return new Response("", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
        }
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
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    try {

      const body = await request.json();

      const text = body.text || "";

      // Demo dịch
      const translated =
        "[Bản dịch AI]\n\n" + text;

      return new Response(
        JSON.stringify({
          success: true,
          original: text,
          translated: translated
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    } catch (err) {

      return new Response(
        JSON.stringify({
          success: false,
          error: err.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    }

  }
}
