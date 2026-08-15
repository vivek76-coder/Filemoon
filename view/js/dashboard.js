window.onload = ()=>{
    checkSession()
}

const toast = new Notyf({
    position:{
        x: 'center', 
        y: 'top'
    }
})

const checkSession = async ()=>{
    const session = await getSession()
    if(!session)
        location.href = '/login'
}

const fecthRecentShared = ()=>{
    try{

    } catch(err) {
        
    }
}