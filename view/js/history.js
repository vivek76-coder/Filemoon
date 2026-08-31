axios.defaults.baseURL = SERVER
window.onload = ()=>{
    checkSession();
    fetchshare();
    fetchImage();
    showUserDetail();
}

const checkSession = async ()=>{
    const session = await getSession()
    if(!session)
        location.href = '/login'
}

const toast = new Notyf({
    position: {x: 'center', y:'top'}
})


const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
  return options;
};

const showUserDetail = async ()=>{
    const session = await getSession()
    const fullname = document.getElementById("fullname")
    const email = document.getElementById("email")
    fullname.innerHTML = session.fullname
    email.innerHTML = session.email
}

const fetchshare = async ()=>{
    try{
        const tbody = document.getElementById("tbody")
        const { data } = await axios.get('/api/share', getToken())
        for(let item of data)
        {
            console.log(item)
            const ui = `
                <tr class="text-gray-500 border-b border-gray-100">
                    <td class="py-4 pl-6">${item.file ? item.file.filename : 'File Deleted'}</td>
                    <td>${item.receiverEmail}</td>
                    <td>${moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                </tr>
            `
            tbody.innerHTML += ui
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
        const error = await (err.response.data).text()
        const {message} = JSON.parse(error)
        toast.error(message)
    }
}