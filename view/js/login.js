axios.defaults.baseURL = SERVER
const toast = new Notyf({
    position: { x: 'center', y: 'top'}
})

const checkSession = async ()=>{
    const session = await getSession()
    if(session)
        location.href= "/dashboard"
} 

checkSession()

const login = async (e)=>{
    try{
        e.preventDefault()
        const form = e.target
        const elements = form.elements
        const payload = {
            email: elements.email.value,
            password: elements.password.value
        }

        const response = await axios.post('api/login', payload)
        toast.success(response.data.message)
        localStorage.setItem("authToken", response.data.token)
    
        setTimeout(()=>{
            location.href = "/dashboard" 
        }, 1000)
    }
    catch(err){
        toast.error(err.response ? err.response.data.message : err.message)
    }
}