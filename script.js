// =========================
// GenSubAI Pro
// script.js v1.5
// =========================

lucide.createIcons();


const videoInput = document.getElementById("videoInput");

const videoPlayer = document.getElementById("videoPlayer");
const videoContainer = document.getElementById("videoContainer");

const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const translateBtn = document.getElementById("translateBtn");

const downloadSrt = document.getElementById("downloadSrt");
const downloadTxt = document.getElementById("downloadTxt");
const downloadVideo = document.getElementById("downloadVideo");


let currentVideoURL = null;



// =========================
// Upload video
// =========================

videoInput.addEventListener("change", e=>{


    const file=e.target.files[0];

    if(!file) return;


    if(currentVideoURL){
        URL.revokeObjectURL(currentVideoURL);
    }


    currentVideoURL =
    URL.createObjectURL(file);



    videoPlayer.src=currentVideoURL;

    videoContainer.classList.remove("hidden");



    originalText.value =
`Video đã chọn:

Tên:
${file.name}

Dung lượng:
${(file.size/1024/1024).toFixed(2)} MB


Trạng thái:
Sẵn sàng dịch AI`;



});




// =========================
// AI Translate Demo Pipeline
// =========================


translateBtn.onclick=()=>{


if(!currentVideoURL){

alert("Hãy chọn video trước");

return;

}



let progress=0;


translatedText.value=
"Đang phân tích video...";



const steps=[
"Đang tách âm thanh...",
"Đang nhận diện giọng nói...",
"Đang dịch sang tiếng Việt...",
"Đang tạo phụ đề..."
];



const timer=setInterval(()=>{


progress+=10;


progressBar.style.width=
progress+"%";


progressText.innerText=
progress+"%";



if(progress===20)
translatedText.value=steps[0];


if(progress===50)
translatedText.value=steps[1];


if(progress===75)
translatedText.value=steps[2];


if(progress===90)
translatedText.value=steps[3];



if(progress>=100){


clearInterval(timer);


translatedText.value=
`1
00:00:00,000 --> 00:00:05,000
Xin chào, đây là phụ đề AI.


2
00:00:05,000 --> 00:00:10,000
GenSubAI Pro đang được phát triển.
`;



progressText.innerText=
"Hoàn thành";


}


},400);


};





// =========================
// Download TXT
// =========================


downloadTxt.onclick=()=>{


downloadFile(
translatedText.value,
"subtitle.txt"
);


};





// =========================
// Download SRT
// =========================


downloadSrt.onclick=()=>{


downloadFile(
translatedText.value,
"subtitle.srt"
);


};





// =========================
// Export Video
// =========================


downloadVideo.onclick=()=>{


alert(
"Chức năng xuất MP4 có phụ đề sẽ thêm ở phiên bản sau."
);


};





function downloadFile(content,name){


const blob=
new Blob(
[content],
{
type:"text/plain"
}
);


const url=
URL.createObjectURL(blob);


const a=
document.createElement("a");


a.href=url;

a.download=name;

a.click();


URL.revokeObjectURL(url);


}
