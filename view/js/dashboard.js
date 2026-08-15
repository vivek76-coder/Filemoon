axios.defaults.baseURL = SERVER
window.onload = ()=>{
    checkSession()
    showUserDetail()
    fecthRecentFiles()
    fetchRecentShared()
    fetchFileReport()
    fetchImage()
}

const toast = new Notyf({
    position:{
        x: 'center', 
        y: 'top'
    }
})

const getToken = ()=>{
    const options = {
        headers: {
            Authorization : `Bearer ${localStorage.getItem("authToken")}`
        }
    }
    return options
}

const checkSession = async ()=>{
    const session = await getSession()
    if(!session)
        location.href = '/login'
}

const getSize = (size) => {
    const kb = size / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;
  
    if (gb >= 1) return gb.toFixed(2) + ' Gb';
    if (mb >= 1) return mb.toFixed(2) + ' Mb';
    if (kb >= 1) return kb.toFixed(2) + ' Kb';
    return size + ' B';
};

const showUserDetail = async ()=>{
    const session = await getSession()
    const fullname = document.getElementById("fullname")
    const email = document.getElementById("email")
    fullname.innerHTML = session.fullname
    email.innerHTML = session.email
}

const fecthRecentFiles = async()=>{
    try{
        const {data} = await axios.get('/api/file?limit=3',getToken())
        const recentFileBox = document.getElementById("recent-files-box")
        
        for(let item of data){
            const ui = `
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="font-medium text-zinc-500 capitalize">${item.filename}</h1>
                    <small class="text-gray-500 text-sm">${getSize(item.size)}</small>
                </div>
                <p class="text-sm text-gray-500">${moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
            </div>`
            recentFileBox.innerHTML += ui
        }
    } catch(err) {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchRecentShared = async (req, res)=>{
    try{
        const {data} = await axios.get('/api/share?limit=3', getToken())
        const recentSharedBox = document.getElementById('recent-shared-box')
        for(let item of data){
            const ui = `
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="font-medium text-zinc-500 capitalize">${item.receiverEmail}</h1>
                    <small class="text-gray-500 text-sm">${item.file ? item.file.filename : 'File Deleted'}</small>
                </div>
                <p class="text-sm text-gray-500">${moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
            </div>
            `
            recentSharedBox.innerHTML += ui
        }
    } catch(err) {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchFileReport = async ()=>{
    try{
        const {data} = await axios.get('/api/dashboard', getToken())
        const reportCard = document.getElementById("report-card")
        for(let item of data){
            console.log(item)
            const ui = `
            <div class="overflow-hidden relative bg-white rounded-lg shadow hover:shadow-lg h-40 flex items-center justify-center flex-col">
            <div class="flex flex-col justify-center items-center w-[100px] h-[100px] rounded-full absolute top-7 z-40" 
            style="background-image: linear-gradient(to right, #68c668 0%, #6465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%);">
            <h1 class="text-xl font-medium text-white">${item._id.split('/').pop()}</h1>
            <p class="text-4xl font-bold text-gray-300">${item.total}</p>
            </div>
            </div>`
            reportCard.innerHTML += ui
        }
    } catch(err) {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}

const uploadImage = ()=>{
    try{
        const input = document.createElement("input")
        const pic = document.getElementById('pic')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
    
        input.onchange = async ()=>{
            const file = input.files[0]
            const formdata = new FormData()
            formdata.append('picture', file)
            await axios.post('/api/profile-picture', formdata, getToken())
            fetchImage()
        }

    } catch(err) {
        toast.error(err.response ? err.response.data.message : err.message)
    }
}

const fetchImage = async ()=>{
    try{
        const options = {
            responseType : 'blob',
            ...getToken()
        }
        const {data} = await axios.get('/api/profile-picture', options)
        const url = URL.createObjectURL(data)
        const pic = document.getElementById("pic")
        pic.src = url
    } catch(err) {
        if(!err.response)
            return toast.error(err.message)
        const error = await (err.response.data.message).text()
        const {message} = JSON.parse(error)
        toast.error(message)
    }
}