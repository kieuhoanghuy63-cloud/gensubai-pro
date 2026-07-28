// =========================
// GenSubAI Pro
// script.js v2.1
// FFmpeg Fixed
// =========================


lucide.createIcons();


// =========================
// Elements
// =========================


const videoInput = document.getElementById("videoInput");

const videoPlayer = document.getElementById("videoPlayer");
const videoContainer = document.getElementById("videoContainer");

const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");

const subtitleBox = document.getElementById("subtitleBox");
const subtitleOverlay = document.getElementById("subtitleOverlay");

const previewSubtitleBtn =
document.getElementById("previewSubtitleBtn");


const progressBar =
document.getElementById("progressBar");

const progressText =
document.getElementById("progressText");


const ffmpegStatus =
document.getElementById("ffmpegStatus");


const translateBtn =
document.getElementById("translateBtn");


const downloadSrt =
document.getElementById("downloadSrt");

const downloadTxt =
document.getElementById("downloadTxt");

const downloadVideo =
document.getElementById("downloadVideo");



// =========================
// Variables
// =========================


let currentVideoFile = null;

let currentVideoURL = null;

let ffmpeg = null;

let ffmpegLoaded = false;





// =========================
// Upload Video
// =========================


videoInput.addEventListener("change", e=>{


const file = e.target.files[0];


if(!file) return;


currentVideoFile = file;



if(currentVideoURL){

URL.revokeObjectURL(currentVideoURL);

}



currentVideoURL =
URL.createObjectURL(file);



videoPlayer.src =
currentVideoURL;



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


if(!currentVideoFile){

alert("Hãy chọn video trước");

return;

}



let progress = 0;


translatedText.value =
"Đang phân tích video...";



const timer =
setInterval(()=>{


progress += 10;



progressBar.style.width =
progress+"%";


progressText.innerText =
progress+"%";



if(progress===20)
translatedText.value =
"Đang tách âm thanh...";



if(progress===50)
translatedText.value =
"Đang nhận diện giọng nói...";



if(progress===75)
translatedText.value =
"Đang dịch sang tiếng Việt...";



if(progress===90)
translatedText.value =
"Đang tạo phụ đề...";



if(progress>=100){


clearInterval(timer);



const subtitle =
`1
00:00:00,000 --> 00:00:05,000
Xin chào, đây là phụ đề AI.


2
00:00:05,000 --> 00:00:10,000
GenSubAI Pro đang được phát triển.
`;



translatedText.value =
subtitle;



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
.replace(
/\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/g,
""
)
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
// Load FFmpeg Fixed
// =========================


async function loadFFmpeg(){


if(ffmpegLoaded){

return;

}



try{


ffmpegStatus.classList.remove("hidden");


ffmpegStatus.innerText =
"Đang tải FFmpeg...";



// kiểm tra thư viện FFmpeg
if(typeof FFmpegWASM === "undefined"){

throw new Error(
"FFmpeg library chưa được tải"
);

}





const { FFmpeg } = FFmpegWASM;

ffmpeg = new FFmpeg();


ffmpeg.on(
"progress",
({progress})=>{

if(!progress) return;

const percent =
Math.round(progress*100);

progressBar.style.width =
percent+"%";

progressText.innerText =
percent+"%";

}
);


await ffmpeg.load({
coreURL:
"https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js",

wasmURL:
"https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm"

});







ffmpegLoaded = true;



ffmpegStatus.innerText =
"FFmpeg đã sẵn sàng";


}


catch(err){


console.error(
"FFmpeg error:",
err
);



ffmpegStatus.innerText =
"Lỗi tải FFmpeg";


alert(
"Không tải được FFmpeg. Hãy kiểm tra kết nối mạng."
);


}


}






// =========================
// Prepare Subtitle
// =========================


function createSRT(){


if(translatedText.value.trim()){


return translatedText.value;


}



return (
`1
00:00:00,000 --> 00:00:05,000
GenSubAI Pro Subtitle`
);


}
// =========================
// Export Video With Subtitle
// =========================


downloadVideo.onclick = async ()=>{


if(!currentVideoFile){

alert("Hãy chọn video trước");

return;

}



try{


downloadVideo.disabled = true;


await loadFFmpeg();



ffmpegStatus.classList.remove("hidden");


ffmpegStatus.innerText =
"Đang chuẩn bị video...";




// Xóa file cũ nếu có

try{

for(const file of [
"input.mp4",
"subtitle.srt",
"output.mp4"
]){

try{
await ffmpeg.deleteFile(file);
}
catch(e){}

}
}

catch(e){}





// Đưa video vào FFmpeg

const videoBuffer =
await currentVideoFile.arrayBuffer();



await ffmpeg.writeFile(
currentVideoFile.name,
new Uint8Array(videoBuffer)
);






// Tạo subtitle

const srt =
createSRT();



await ffmpeg.writeFile(
"subtitle.srt",
new TextEncoder().encode(srt)
);





ffmpegStatus.innerText =
"Đang ghép phụ đề vào video...";





// Chạy FFmpeg

await ffmpeg.exec([
  
"-i",
currentVideoFile.name,
  
"-vf",
"subtitles=subtitle.srt",
  
"-c:a",
"copy",

"output.mp4"

]);






ffmpegStatus.innerText =
"Đang tạo file MP4...";






const output =
await ffmpeg.readFile(
"output.mp4"
);






const blob =
new Blob(
[
output
],
{
type:"video/mp4"
}
);





const url =
URL.createObjectURL(blob);





const a =
document.createElement("a");


a.href =
url;


a.download =
"GenSubAI_Subtitle.mp4";


document.body.appendChild(a);


a.click();


document.body.removeChild(a);





URL.revokeObjectURL(url);





ffmpegStatus.innerText =
"Hoàn thành! Video đã xuất.";





}

catch(err){


console.error(
"Export video lỗi:",
err
);



ffmpegStatus.innerText =
"Lỗi xuất video";


alert(
`Không thể tạo video.

Có thể do:
- Video quá lớn
- Điện thoại thiếu bộ nhớ
- Trình duyệt không hỗ trợ
- Mạng yếu khi tải FFmpeg`
);


}

finally{


downloadVideo.disabled = false;


}


};







// =========================
// Download Function
// =========================


function downloadFile(content,name){



const blob =
new Blob(
[
content
],
{
type:"text/plain"
}
);



const url =
URL.createObjectURL(blob);



const a =
document.createElement("a");


a.href =
url;


a.download =
name;


document.body.appendChild(a);


a.click();


document.body.removeChild(a);



URL.revokeObjectURL(url);


}
