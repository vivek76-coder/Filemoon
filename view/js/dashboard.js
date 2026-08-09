window.onload = ()=>{
    checkSession()
}

const checkSession = async ()=>{
    const session = await getSession()
    if(!session)
        location.href = '/login'
}
