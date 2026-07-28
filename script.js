// ========================================
// GenSubAI Pro v3
// script.js
// Rewrite by ChatGPT
// ========================================

// =======================
// Khởi tạo Icon
// =======================

if (typeof lucide !== "undefined") {
    lucide.createIcons();
}

// =======================
// Lấy phần tử HTML
// =======================

const videoInput = document.getElementById("videoInput");
const videoPlayer = document.getElementById("videoPlayer");
const videoContainer = document.getElementById("videoContainer");

const originalText = document.getElementById("originalText");
const translatedText = document.getElementById("translatedText");

const subtitleBox = document.getElementById("subtitleBox");
const subtitleOverlay = document.getElementById("subtitleOverlay");

const previewSubtitleBtn =
    document.getElementById("previewSubtitleBtn");

const translateBtn =
    document.getElementById("translateBtn");

const downloadTxt =
    document.getElementById("downloadTxt");

const downloadSrt =
    document.getElementById("downloadSrt");

const downloadVideo =
    document.getElementById("downloadVideo");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const ffmpegStatus =
    document.getElementById("ffmpegStatus");

// =======================
// Biến toàn cục
// =======================

let currentVideoFile = null;
let currentVideoURL = null;

let ffmpeg = null;
let ffmpegLoaded = false;

// =======================
// Cập nhật tiến trình
// =======================

function setProgress(percent) {

    percent = Math.max(0, Math.min(100, percent));

    progressBar.style.width = percent + "%";
    progressText.innerText = percent + "%";

}

// =======================
// Hiển thị trạng thái
// =======================

function setStatus(message) {

    ffmpegStatus.classList.remove("hidden");

    ffmpegStatus.innerText = message;

}

// =======================
// Hiển thị lỗi
// =======================

function showError(message) {

    console.error(message);

    setStatus("❌ " + message);

    alert(message);

}

// =======================
// Reset giao diện
// =======================

function resetUI() {

    setProgress(0);

    subtitleOverlay.classList.add("hidden");

    subtitleBox.innerText = "Chưa có phụ đề";

    translatedText.value = "";

}
// =======================
// Upload Video
// =======================

videoInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Chỉ cho phép video
    if (!file.type.startsWith("video/")) {

        showError("Vui lòng chọn một tệp video.");

        return;
    }

    // Giải phóng URL cũ
    if (currentVideoURL) {
        URL.revokeObjectURL(currentVideoURL);
    }

    currentVideoFile = file;

    currentVideoURL = URL.createObjectURL(file);

    videoPlayer.src = currentVideoURL;

    videoPlayer.load();

    videoContainer.classList.remove("hidden");

    resetUI();

    originalText.value =
`Video đã chọn

Tên:
${file.name}

Định dạng:
${file.type || "Không xác định"}

Dung lượng:
${(file.size / 1024 / 1024).toFixed(2)} MB

Trạng thái:
Sẵn sàng xử lý`;

    setStatus("Đã chọn video.");

});

// =======================
// Khi video tải xong
// =======================

videoPlayer.addEventListener("loadedmetadata", () => {

    if (!currentVideoFile) return;

    const duration = videoPlayer.duration || 0;

    originalText.value +=
`

Thời lượng:
${duration.toFixed(1)} giây`;

});

// =======================
// Lỗi video
// =======================

videoPlayer.addEventListener("error", () => {

    showError("Không thể mở video.");

});

// =======================
// Xóa phụ đề khi phát lại
// =======================

videoPlayer.addEventListener("play", () => {

    subtitleOverlay.classList.add("hidden");

});

// =======================
// Hiện phụ đề khi tạm dừng
// =======================

videoPlayer.addEventListener("pause", () => {

    if (translatedText.value.trim()) {

        subtitleOverlay.classList.remove("hidden");

    }

});
// =======================
// AI Demo Pipeline
// =======================

translateBtn.addEventListener("click", () => {

    if (!currentVideoFile) {

        showError("Hãy chọn video trước.");

        return;

    }

    translatedText.value = "Đang phân tích video...";

    setProgress(0);

    const steps = [
        "Đang tách âm thanh...",
        "Đang nhận diện giọng nói...",
        "Đang dịch sang tiếng Việt...",
        "Đang tạo phụ đề..."
    ];

    let progress = 0;

    let index = 0;

    const timer = setInterval(() => {

        progress += 10;

        setProgress(progress);

        if (
            progress === 20 ||
            progress === 50 ||
            progress === 75 ||
            progress === 90
        ) {

            translatedText.value = steps[index];
            index++;

        }

        if (progress >= 100) {

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

            progressText.innerText = "Hoàn thành";

            setStatus("Đã tạo phụ đề.");

        }

    }, 400);

});

// =======================
// Xem trước phụ đề
// =======================

previewSubtitleBtn.addEventListener("click", () => {

    if (!translatedText.value.trim()) {

        showError("Chưa có phụ đề.");

        return;

    }

    showSubtitle(translatedText.value);

});

// =======================
// Hiển thị phụ đề
// =======================

function showSubtitle(text) {

    const cleanText = text

        .replace(/\d+\n/g, "")

        .replace(
            /\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/g,
            ""
        )

        .replace(/\n{2,}/g, "\n")

        .trim();

    subtitleBox.innerText = cleanText;

    subtitleOverlay.innerText = cleanText;

    subtitleOverlay.classList.remove("hidden");

}
// =======================
// Tạo nội dung SRT
// =======================

function createSRT() {

    const text = translatedText.value.trim();

    if (text.length > 0) {
        return text;
    }

    return `1
00:00:00,000 --> 00:00:05,000
GenSubAI Pro Subtitle`;
}

// =======================
// Hàm tải file
// =======================

function downloadFile(content, fileName) {

    const blob = new Blob(
        [content],
        {
            type: "text/plain;charset=utf-8"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);

}

// =======================
// Tải TXT
// =======================

downloadTxt.addEventListener("click", () => {

    if (!translatedText.value.trim()) {

        showError("Chưa có phụ đề để tải.");

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

downloadSrt.addEventListener("click", () => {

    if (!translatedText.value.trim()) {

        showError("Chưa có phụ đề để tải.");

        return;

    }

    downloadFile(
        createSRT(),
        "subtitle.srt"
    );

});
// =======================
// Load FFmpeg
// =======================

async function loadFFmpeg() {

    if (ffmpegLoaded) {
        return;
    }

    setStatus("Đang tải FFmpeg...");

    try {

        if (!window.FFmpegWASM) {
            throw new Error("FFmpeg chưa được nạp.");
        }

        const { FFmpeg } = window.FFmpegWASM;

        ffmpeg = new FFmpeg();

        ffmpeg.on("log", ({ message }) => {
            console.log("[FFmpeg]", message);
        });

        ffmpeg.on("progress", ({ progress }) => {

            if (progress == null) return;

            const percent = Math.round(progress * 100);

            setProgress(percent);

        });

        setStatus("Đang tải FFmpeg Core...");

        await ffmpeg.load({

            coreURL:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.js",

            wasmURL:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm"

        });

        ffmpegLoaded = true;

        setStatus("FFmpeg đã sẵn sàng.");

    }

    catch (err) {

        console.error(err);

        ffmpegLoaded = false;

        showError(err.message);

        throw err;

    }

}
// =======================
// Xuất video có phụ đề
// =======================

downloadVideo.addEventListener("click", async () => {

    if (!currentVideoFile) {

        showError("Hãy chọn video trước.");

        return;

    }

    try {

        downloadVideo.disabled = true;

        setProgress(0);

        await loadFFmpeg();

        setStatus("Đang chuẩn bị video...");

        // Xóa file cũ
        for (const file of [
            currentVideoFile.name,
            "subtitle.srt",
            "output.mp4"
        ]) {

            try {
                await ffmpeg.deleteFile(file);
            } catch (e) {}

        }

        // Ghi video vào bộ nhớ FFmpeg

        const buffer = await currentVideoFile.arrayBuffer();

        await ffmpeg.writeFile(
            currentVideoFile.name,
            new Uint8Array(buffer)
        );

        // Ghi phụ đề

        await ffmpeg.writeFile(
            "subtitle.srt",
            new TextEncoder().encode(createSRT())
        );

        setStatus("Đang ghép phụ đề...");

        await ffmpeg.exec([

            "-i",
            currentVideoFile.name,

            "-vf",
            "subtitles=subtitle.srt",

            "-c:v",
            "libx264",

            "-preset",
            "ultrafast",

            "-c:a",
            "copy",

            "-movflags",
            "+faststart",

            "output.mp4"

        ]);

        setStatus("Đang đọc video...");

        const data = await ffmpeg.readFile("output.mp4");

        const blob = new Blob(
            [data.buffer],
            {
                type: "video/mp4"
            }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "GenSubAI_Subtitle.mp4";

        document.body.appendChild(a);

        a.click();

        a.remove();

        setTimeout(() => {

            URL.revokeObjectURL(url);

        }, 1000);

        setProgress(100);

        setStatus("Xuất video thành công.");

    }

    catch (err) {

        console.error(err);

        showError(
            "Không thể tạo video.\n\n" +
            err.message
        );

    }

    finally {

        downloadVideo.disabled = false;

    }

});
