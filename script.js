// ========================================
// GenSubAI Pro v4
// script.js
// Cloudflare Pages Function version
// Không dùng FFmpeg trên trình duyệt
// ========================================


if (typeof lucide !== "undefined") {
    lucide.createIcons();
}


// =======================
// HTML Elements
// =======================

const videoInput =
document.getElementById("videoInput");

const videoPlayer =
document.getElementById("videoPlayer");

const videoContainer =
document.getElementById("videoContainer");


const originalText =
document.getElementById("originalText");


const translatedText =
document.getElementById("translatedText");


const subtitleBox =
document.getElementById("subtitleBox");


const subtitleOverlay =
document.getElementById("subtitleOverlay");


const previewSubtitleBtn =
document.getElementById("previewSubtitleBtn");


const translateBtn =
document.getElementById("translateBtn");


const downloadSrt =
document.getElementById("downloadSrt");


const downloadTxt =
document.getElementById("downloadTxt");


const downloadVideo =
document.getElementById("downloadVideo");


const progressBar =
document.getElementById("progressBar");


const progressText =
document.getElementById("progressText");


const ffmpegStatus =
document.getElementById("ffmpegStatus");



// =======================
// Variables
// =======================

let currentVideoFile = null;

let currentVideoURL = null;



// =======================
// Progress
// =======================

function setProgress(value){

    value = Math.min(
        100,
        Math.max(0,value)
    );

    progressBar.style.width =
    value + "%";

    progressText.innerText =
    value + "%";

}



// =======================
// Status
// =======================

function setStatus(text){

    ffmpegStatus.classList.remove("hidden");

    ffmpegStatus.innerText = text;

}



// =======================
// Error
// =======================

function showError(text){

    console.error(text);

    setStatus(
        "❌ " + text
    );

    alert(text);

}
// =======================
// Upload Video
// =======================

videoInput.addEventListener("change", (e)=>{

    const file = e.target.files[0];


    if(!file){
        return;
    }


    if(!file.type.startsWith("video/")){

        showError(
            "Vui lòng chọn file video."
        );

        return;
    }


    if(currentVideoURL){

        URL.revokeObjectURL(
            currentVideoURL
        );

    }


    currentVideoFile = file;


    currentVideoURL =
    URL.createObjectURL(file);


    videoPlayer.src =
    currentVideoURL;


    videoPlayer.load();


    videoContainer.classList.remove(
        "hidden"
    );



    originalText.value =
`Video đã chọn

Tên:
${file.name}

Dung lượng:
${(file.size / 1024 / 1024).toFixed(2)} MB

Trạng thái:
Sẵn sàng tạo phụ đề AI`;



    translatedText.value = "";

    subtitleBox.innerText =
    "Chưa có phụ đề";


    subtitleOverlay.classList.add(
        "hidden"
    );


    setProgress(0);


    setStatus(
        "Đã nhận video."
    );


});




// =======================
// Gửi yêu cầu API
// =======================

async function requestAI(text){


    try{


        setStatus(
            "Đang gửi dữ liệu tới AI..."
        );


        const response =
        await fetch(
            "/api/translate",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({

                    text:text

                })

            }
        );



        const data =
        await response.json();



        if(!data.success){

            throw new Error(
                data.error ||
                "API lỗi"
            );

        }



        return data;



    }
    catch(error){


        throw error;


    }

}




// =======================
// Dịch bằng AI
// =======================

translateBtn.addEventListener(
"click",
async ()=>{


    if(!currentVideoFile){

        showError(
            "Hãy chọn video trước."
        );

        return;

    }



    try{


        translateBtn.disabled = true;


        setProgress(10);



        translatedText.value =
        "Đang phân tích video...";



        // Tạm thời gửi tên video
        // Sau này thay bằng Whisper

        const result =
        await requestAI(
            currentVideoFile.name
        );



        setProgress(80);



        translatedText.value =
        result.srt;



        showSubtitle(
            result.srt
        );


        setProgress(100);



        setStatus(
            "Đã tạo phụ đề."
        );



    }

    catch(error){


        showError(
            error.message
        );


    }

    finally{


        translateBtn.disabled =
        false;


    }



});
// =======================
// Hiển thị phụ đề xem trước
// =======================

function showSubtitle(text){


    const cleanText =
    text

    .replace(
        /\d+\n/g,
        ""
    )

    .replace(
        /\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/g,
        ""
    )

    .replace(
        /\n{2,}/g,
        "\n"
    )

    .trim();



    subtitleBox.innerText =
    cleanText;


    subtitleOverlay.innerText =
    cleanText;


    subtitleOverlay.classList.remove(
        "hidden"
    );


}




// =======================
// Nút xem trước phụ đề
// =======================

previewSubtitleBtn.addEventListener(
"click",
()=>{


    if(
        !translatedText.value.trim()
    ){

        showError(
            "Chưa có phụ đề."
        );

        return;

    }


    showSubtitle(
        translatedText.value
    );


});




// =======================
// Tạo SRT
// =======================

function createSRT(){


    if(
        translatedText.value.trim()
    ){

        return translatedText.value;

    }



    return `1
00:00:00,000 --> 00:00:05,000
GenSubAI Pro`;

}




// =======================
// Tải file
// =======================

function downloadFile(
content,
name
){


    const blob =
    new Blob(
        [
            content
        ],
        {
            type:
            "text/plain;charset=utf-8"
        }
    );



    const url =
    URL.createObjectURL(blob);



    const a =
    document.createElement("a");


    a.href = url;


    a.download = name;



    document.body.appendChild(a);


    a.click();


    a.remove();



    setTimeout(
        ()=>{
            URL.revokeObjectURL(url);
        },
        500
    );

}




// =======================
// Tải TXT
// =======================

downloadTxt.addEventListener(
"click",
()=>{


    if(
        !translatedText.value.trim()
    ){

        showError(
            "Chưa có nội dung."
        );

        return;

    }



    downloadFile(
        translatedText.value,
        "subtitle.txt"
    );


});





// =======================
// Tải SRT
// =======================

downloadSrt.addEventListener(
"click",
()=>{


    if(
        !translatedText.value.trim()
    ){

        showError(
            "Chưa có phụ đề."
        );

        return;

    }



    downloadFile(
        createSRT(),
        "subtitle.srt"
    );


});
// =======================
// Tạo video có phụ đề
// =======================
// Không dùng FFmpeg trên trình duyệt
// Tránh treo iPhone
// =======================

downloadVideo.addEventListener(
"click",
()=>{


    if(!currentVideoFile){

        showError(
            "Hãy chọn video trước."
        );

        return;

    }



    if(!translatedText.value.trim()){

        showError(
            "Hãy tạo phụ đề trước."
        );

        return;

    }



    /*
        Phiên bản này chưa ghép video trực tiếp.
        Nó sẽ tải SRT để người dùng ghép sau.

        Lý do:
        FFmpeg.wasm chạy trên iPhone dễ treo
        với video dài vài phút trở lên.

        Bước tiếp theo có thể đưa việc ghép
        video lên Cloudflare Worker/R2.
    */



    const srt =
    createSRT();



    downloadFile(
        srt,
        "GenSubAI_Subtitle.srt"
    );



    setStatus(
        "Đã xuất file phụ đề SRT. Video gốc không bị xử lý trên máy."
    );


});




// =======================
// Dọn bộ nhớ khi rời trang
// =======================

window.addEventListener(
"beforeunload",
()=>{


    if(currentVideoURL){

        URL.revokeObjectURL(
            currentVideoURL
        );

    }


});
