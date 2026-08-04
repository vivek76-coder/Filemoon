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

const uploadFile = async (e) => {
  try {
    e.preventDefault();
    const progress = document.getElementById("progress-bar");
    const uploadBtn = document.getElementById("upload-btn");
    const form = e.target;
    const formData = new FormData(form);
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
                        <td>${file.type}</td>
                        <td>${getSize(file.size)} Mb</td>
                        <td>${moment(file.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                        <td>
                            <div class="space-x-3">
                                <button class="bg-rose-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick="deleteFile('${file._id}')">
                                    <i class="ri-delete-bin-4-line"></i>
                                </button>
                                <button class="bg-green-400 px-2 py-1 text-white hover:bg-green-500 rounded" onclick="downloadFile('${file._id}', '${file.filename}')">
                                    <i class="ri-download-line"></i>
                                </button>
                                <button class="bg-amber-400 px-2 py-1 text-white hover:bg-amber-600 rounded">
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

const deleteFile = async (id) => {
  try{
    await axios.delete(`api/file/${id}`)
    fetchFile()
  } catch(err) {
    toast.error(err.response  ? err.response.data.message : err.message)
  }
};

const downloadFile = async (id, filename)=>{
  try{
    const option = {
      responseType : 'blob'
    }
    const { data } = await axios.get(`/api/file/download/${id}`, option)
    const ext = data.type.split("/").pop()
    const url = URL.createObjectURL(data)
    const a  = document.createElement("a")
    a.href = url
    a.download = `${filename}.${ext}`
    a.click()
    a.remove()
  } catch(err) {
    toast.error(err.response ? err.response.data.message : err.message)
  }
}
