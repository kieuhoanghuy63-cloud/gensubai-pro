// =========================
// GenSubAI Pro
// script.js v1.6
// =========================


lucide.createIcons();



const videoInput = document.getElementById("videoInput");

const videoPlayer = document.getElementById("videoPlayer");
const videoContainer = document.getElementById("videoContainer");

const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");

const subtitleBox = document.getElementById("subtitleBox");
const subtitleOverlay = document.getElementById("subtitleOverlay");

const previewSubtitleBtn = document.getElementById("previewSubtitleBtn");


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


const file = e.target.files[0];


if(!file) return;



if(currentVideoURL){

URL.revokeObjectURL(currentVideoURL);

}



currentVideoURL =
URL.createObjectURL(file);



videoPlayer.src = currentVideoURL;


videoContainer.classList.remove("hidden");



originalText.value =
`Video đã chọn:

Tên:
${file.name}

Dung lượng:
${(file.size/1024/1024).toFixed(2)} MB


Trạng thái:
Sẵn sàng xử lý AI`;



});






// =========================
// AI Demo Pipeline
// =========================


translateBtn.onclick = ()=>{


if(!currentVideoURL){

alert("Hãy chọn video trước");

return;

}



let progress = 0;



translatedText.value =
"Đang phân tích video...";



const timer = setInterval(()=>{


progress += 10;



progressBar.style.width =
progress + "%";


progressText.innerText =
progress + "%";



if(progress === 20){

translatedText.value =
"Đang tách âm thanh...";

}



if(progress === 50){

translatedText.value =
"Đang nhận diện giọng nói...";

}



if(progress === 75){

translatedText.value =
"Đang dịch sang tiếng Việt...";

}



if(progress === 90){

translatedText.value =
"Đang tạo phụ đề...";

}




if(progress >= 100){


clearInterval(timer);



const subtitle =
`1
00:00:00,000 --> 00:00:05,000
Xin chào, đây là phụ đề AI.


2
00:00:05,000 --> 00:00:10,000
GenSubAI Pro đang được phát triển.
`;



translatedText.value = subtitle;



showSubtitle(subtitle);



progressText.innerText =
"Hoàn thành";


}


},400);



};






// =========================
// Preview Subtitle
// =========================


previewSubtitleBtn.onclick = ()=>{


const text =
translatedText.value;



if(!text.trim()){

alert("Chưa có phụ đề");

return;

}



showSubtitle(text);


};







function showSubtitle(text){



let cleanText =
text
.replace(/[0-9]/g,"")
.replace(/\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/g,"")
.trim();



subtitleBox.innerText =
cleanText;



subtitleOverlay.innerText =
cleanText;



subtitleOverlay.classList.remove("hidden");


}







// =========================
// Download TXT
// =========================


downloadTxt.onclick = ()=>{


downloadFile(
translatedText.value,
"subtitle.txt"
);


};







// =========================
// Download SRT
// =========================


downloadSrt.onclick = ()=>{


downloadFile(
translatedText.value,
"subtitle.srt"
);


};







// =========================
// Export Video chuẩn bị
// =========================


downloadVideo.onclick = ()=>{


alert(
`Tính năng tạo video có phụ đề đang được phát triển.

Sắp tới:
✔ Chèn phụ đề vào MP4
✔ Xuất video
✔ Lưu vào album điện thoại`
);


};







// =========================
// Download Function
// =========================


function downloadFile(content,name){



const blob =
new Blob(
[content],
{
type:"text/plain"
}
);



const url =
URL.createObjectURL(blob);



const a =
document.createElement("a");



a.href = url;


a.download = name;


a.click();



URL.revokeObjectURL(url);



}
