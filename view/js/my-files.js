const drawer = document.getElementById('drawer')

const toggleDrawer = ()=>{
    const rightValue = drawer.style.right

    if(rightValue === "0%")
    {
        drawer.style.right = "-33.33%"
    }
    else{
        drawer.style.right = "0%"
    }
}