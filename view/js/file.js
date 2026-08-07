axios.defaults.baseURL = SERVER;

const toast = new Notyf({
  position: { x: "center", y: "top" },
});

window.onload = () => {
  checkSession();
  fetchFile();
};

const checkSession = async () => {
  const session = await getSession();
  if (!session) location.href = "/login";
};

const drawer = document.getElementById("drawer");
const toggleDrawer = () => {
  const rightValue = drawer.style.right;

  if (rightValue === "0%") {
    drawer.style.right = "-33.33%";
  } else {
    drawer.style.right = "0%";
  }
};

const getSize = (fileSize) => {
  const mb = fileSize / 1000 / 1000;
  return mb.toFixed(1);
};

const getExtentionForDownload = (ext) => {
  if (
    ext === "x-msdownload" ||
    ext === "x-msdos-program" ||
    ext === "octet-stream"
  )
    return (ext = "exe");

  return ext;
};
const uploadFile = async (e) => {
  try {
    e.preventDefault();
    const progress = document.getElementById("progress-bar");
    const uploadBtn = document.getElementById("upload-btn");

    const form = e.target;
    const formData = new FormData(form);

    const file = formData.get("file");
    const size = getSize(file.size);
    if (size > 200) return toast.error("max size 200 MB");

    const option = {
      onUploadProgress: (e) => {
        const loaded = e.loaded;
        const total = e.total;
        const precentValue = Math.floor((loaded * 100) / total);
        progress.style.width = `${precentValue}%`;
        progress.innerHTML = `${precentValue} %`;
      },
    };
    uploadBtn.disabled = true;
    const { data } = await axios.post("/api/files", formData, option);
    toast.success(`${data.filename} uploaded successfully`);
    uploadBtn.disabled = false;

    fetchFile();
    progress.style.width = 0;
    progress.innerHTML = "";
    toggleDrawer();
    form.reset();
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchFile = async () => {
  try {
    const table = document.getElementById("table-file");
    const { data } = await axios.get("/api/file");
    table.innerHTML = "";
    for (let file of data) {
      const ui = `<tr class="text-gray-500 border-b border-gray-100">
                        <td class="py-4 pl-6 capitalize">${file.filename}</td>
                        <td>${file.type.split("/").pop()}</td>
                        <td>${getSize(file.size)} Mb</td>
                        <td>${moment(file.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                        <td>
                            <div class="space-x-3">
                                <button class="bg-rose-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick="deleteFile('${file._id}', this)">
                                    <i class="ri-delete-bin-4-line"></i>
                                </button>
                                <button class="bg-green-400 px-2 py-1 text-white hover:bg-green-500 rounded" onclick="downloadFile('${file._id}', '${file.filename}', this)">
                                    <i class="ri-download-line"></i>
                                </button>
                                <button class="bg-amber-400 px-2 py-1 text-white hover:bg-amber-600 rounded" onclick="openModelForShare('${file._id}', '${file.filename}', this)">
                                    <i class="ri-share-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;

      table.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const deleteFile = async (id, button) => {
  try {
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    button.disabled = true;
    await axios.delete(`api/file/${id}`);
    fetchFile();
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  } finally {
    button.innerHTML = '<i class="ri-delete-bin-4-line"></i>';
    button.disabled = false;
    fetchFile();
  }
};

const downloadFile = async (id, filename, button) => {
  try {
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    button.disabled = true;
    const option = {
      responseType: "blob",
    };
    const { data } = await axios.get(`/api/file/download/${id}`, option);
    const ext = getExtentionForDownload(data.type.split("/").pop());
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    a.remove();
  } catch (err) {
    if (!err.response) return toast.error(err.message);
    const error = await err.response.data.text();
    toast.error(JSON.parse(error));
  } finally {
    button.innerHTML = '<i class="ri-download-line"></i>';
    button.disabled = false;
  }
};

const openModelForShare = (id, filename) => {
  new Swal({
    showConfirmButton: false,
    html: `
          <form class="text-left flex flex-col gap-6" onsubmit="shareFile('${id}', event)">
            <input type="email"name="email" required class="border border-gray-300 w-full p-3 rounded" placeholder="mail@gmail.com"/>
            <button id="send-btn" class="bg-indigo-400 hover:bg-indigo-500 text-whitre rounded px-10 py-3 w-fit font-medium">Send</button>
          </form>
          <div class="flex items-center gap-2 pt-2">
            <p class="text-gray-500">you are sharing - </p>
            <p class="text-green-400 font-medium">${filename}</p>
          </div>
    `,
  });
};

const shareFile = async (id, e) => {
  const sendBtn = document.getElementById("send-btn");
  try {
    e.preventDefault();
    const email = e.target.elements.email.value;
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
    <i class="fa fa-spinner fa-spin mr-2"></i> Processing
   `;
    const payload = {
      email: email,
      fileId: id,
    };
    await axios.post("/api/share", payload);
    toast.success("send");
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  } finally {
    Swal.close();
  }
};
