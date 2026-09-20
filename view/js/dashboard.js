axios.defaults.baseURL = SERVER;
window.onload = () => {
  checkSession();
  showUserDetail();
  fetchRecentFiles();
  fetchRecentShared();
  fetchFileReport();
  fetchImage();
};

const toast = new Notyf({
  position: {
    x: "center",
    y: "top",
  },
});

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
  return options;
};

const checkSession = async () => {
  const session = await getSession();
  if (!session) location.href = "/login";
};

const getSize = (size) => {
  const kb = size / 1000;
  const mb = kb / 1000;
  const gb = mb / 1000;

  if (gb >= 1) return gb.toFixed(2) + " Gb";
  if (mb >= 1) return mb.toFixed(2) + " Mb";
  if (kb >= 1) return kb.toFixed(2) + " Kb";
  return size + " B";
};

const showUserDetail = async () => {
  const session = await getSession();
  const fullnames = document.querySelectorAll("#fullname");
  const email = document.getElementById("email");
  fullnames.forEach((el) => {
    el.innerHTML = session.fullname;
  });
  if (email) email.innerHTML = session.email;
};

const fetchRecentFiles = async () => {
  try {
    const { data } = await axios.get("/api/file?limit=3", getToken());
    const recentFileBox = document.getElementById("recent-files-box");
    if (!recentFileBox) return;
    recentFileBox.innerHTML = "";
    for (let item of data) {
      const ui = `
            <div class="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-lg bg-indigo-100/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <i class="ri-file-zip-line text-base"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">${item.filename}</p>
                  <p class="text-xs text-slate-400">${getSize(item.size)}</p>
                </div>
              </div>
              <span class="text-xs text-slate-500 font-medium flex items-center gap-1.5 shrink-0 bg-white px-2 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                <span class="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                ${moment(item.createdAt).format("DD MMM YYYY, hh:mm A")}
              </span>
            </div>`;
      recentFileBox.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchRecentShared = async () => {
  try {
    const { data } = await axios.get("/api/share?limit=3", getToken());
    const recentSharedBox = document.getElementById("recent-shared-box");
    if (!recentSharedBox) return;
    recentSharedBox.innerHTML = "";
    for (let item of data) {
      const ui = `
            <div class="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 transition-all flex flex-col gap-2">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <i class="ri-share-forward-line text-indigo-600 text-sm"></i>
                  <span class="text-sm font-medium text-slate-800 truncate">${item.file ? item.file.filename : "File Deleted"}</span>
                </div>
                <span class="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0">
                  <span class="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                  ${moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
                </span>
              </div>
            </div>
            `;
      recentSharedBox.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchFileReport = async () => {
  try {
    const { data } = await axios.get("/api/dashboard", getToken());
    const reportCard = document.getElementById("report-card");
    if (!reportCard) return;

    let documentsTotal = 0;
    let imagesTotal = 0;
    let videosTotal = 0;
    let archivesAudioTotal = 0;

    for (let item of data) {
      const type = (item._id || "").toLowerCase();
      const total = item.total || 0;

      if (type.startsWith("image/")) {
        imagesTotal += total;
      } else if (type.startsWith("video/")) {
        videosTotal += total;
      } else if (
        type.startsWith("audio/") ||
        type.includes("zip") ||
        type.includes("tar") ||
        type.includes("rar") ||
        type.includes("7z") ||
        type.includes("compressed") ||
        type.includes("archive") ||
        type.includes("gzip")
      ) {
        archivesAudioTotal += total;
      } else {
        documentsTotal += total;
      }
    }

    const ui = `
            <!-- Category 1 -->
            <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-slate-800">Documents</span>
                  <span class="text-[11px] text-slate-400">PDF, DOCX</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">${documentsTotal}</span>
            </div>

            <!-- Category 2 -->
            <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[20px]">image</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-slate-800">Images</span>
                  <span class="text-[11px] text-slate-400">PNG, JPG, SVG</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">${imagesTotal}</span>
            </div>

            <!-- Category 3 -->
            <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[20px]">movie</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-slate-800">Videos</span>
                  <span class="text-[11px] text-slate-400">MP4, MOV, WEBM</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">${videosTotal}</span>
            </div>

            <!-- Category 4 -->
            <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[20px]">folder_zip</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-slate-800">Archives & Audio</span>
                  <span class="text-[11px] text-slate-400">ZIP, TAR, MP3</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">${archivesAudioTotal}</span>
            </div>`;
    reportCard.innerHTML = ui;
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const uploadImage = () => {
  try {
    const input = document.createElement("input");
    const pic = document.getElementById("pic");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formdata = new FormData();
      formdata.append("picture", file);
      await axios.post("/api/profile-picture", formdata, getToken());
      fetchImage();
    };
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchImage = async () => {
  try {
    const options = {
      responseType: "blob",
      ...getToken(),
    };
    const { data } = await axios.get("/api/profile-picture", options);
    const url = URL.createObjectURL(data);
    const pics = document.querySelectorAll("#pic");
    pics.forEach((pic) => {
      pic.src = url;
    });
  } catch (err) {
    if (!err.response) return toast.error(err.message);
    const error = await err.response.data.text();
    const { message } = JSON.parser(error);
    toast.error(message);
  }
};

const toggleProfileToast = () => {
  const profileToastId = document.getElementById("profileToast");
  if (profileToastId) {
    profileToastId.classList.toggle("hidden");
  }
};