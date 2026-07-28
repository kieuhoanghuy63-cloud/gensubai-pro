// =========================
// GenSubAI Pro
// script.js
// =========================

lucide.createIcons();

const videoInput = document.getElementById("videoInput");
const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const translateBtn = document.getElementById("translateBtn");

const downloadSrt = document.getElementById("downloadSrt");
const downloadTxt = document.getElementById("downloadTxt");
const downloadVideo = document.getElementById("downloadVideo");

let currentVideo = null;

videoInput.addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    currentVideo = file;

    // Hiển thị video
    const videoPlayer = document.getElementById("videoPlayer");
    const videoContainer = document.getElementById("videoContainer");

    videoPlayer.src = URL.createObjectURL(file);
    videoContainer.classList.remove("hidden");

    originalText.value =
`Đã chọn video:

${file.name}

Kích thước:
${(file.size/1024/1024).toFixed(2)} MB

Đang chờ AI xử lý...`;

});

    const file = e.target.files[0];

    if (!file) return;

    currentVideo = file;

    originalText.value =
`Đã chọn video:
${file.name}

Kích thước:
${(file.size/1024/1024).toFixed(2)} MB

Trạng thái:
Sẵn sàng xử lý bằng AI.`;

});

translateBtn.addEventListener("click", async ()=>{

    progressBar.style.width="0%";
    progressText.innerHTML="0%";

    translatedText.value="Đang khởi tạo AI...";

    let percent=0;

    const timer=setInterval(()=>{

        percent+=5;

        progressBar.style.width=percent+"%";

        progressText.innerHTML=percent+"%";

        if(percent>=100){

            clearInterval(timer);

            translatedText.value=
`Đây chỉ là bản DEMO.

Ở phiên bản tiếp theo chúng ta sẽ kết nối:

• Whisper AI
• GPT
• AI Subtitle
• AI Voice

để tự động dịch toàn bộ video sang Tiếng Việt.`;

        }

    },120);

});

downloadTxt.addEventListener("click",()=>{

    const blob=new Blob(
        [translatedText.value],
        {type:"text/plain"}
    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="subtitle.txt";

    a.click();

});

downloadSrt.addEventListener("click",()=>{

    const srt=`1
00:00:00,000 --> 00:00:05,000
${translatedText.value}`;

    const blob=new Blob(
        [srt],
        {type:"text/plain"}
    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="subtitle.srt";

    a.click();

});

downloadVideo.addEventListener("click",()=>{

    alert(
`Phiên bản V2 sẽ hỗ trợ:

✔ AI dịch video

✔ AI chèn phụ đề

✔ AI lồng tiếng

✔ Xuất video MP4`
);

});
