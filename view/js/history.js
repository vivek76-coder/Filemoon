window.onload = ()=>{
    checkSession()
    fetchshare()
}

const toast = new Notyf({
    position: {x: 'center', y:'top'}
})

const checkSession = async ()=>{
    const session = await getSession()
    if(!session)
        location.href = '/login'
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: ` Bearer ${localStorage.getItem("authToken")}`,
    },
  };
  return options;
};

const fetchshare = async ()=>{
    try{
        const tbody = document.getElementById("tbody")
        const { data } = await axios.get('/api/share', getToken())
        for(let item of data)
        {
            console.log(item)
            const ui = `
                <tr class="text-gray-500 border-b border-gray-100">
                    <td class="py-4 pl-6">${item.file.filename}</td>
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