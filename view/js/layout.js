const sidebar = document.getElementById("sidebar")
const section = document.getElementById("section")

const toggleSidebar = ()=>{
    const sidebarWidth = sidebar.style.width
    
    if(sidebarWidth === "250px") {
        sidebar.style.width = "0px"
        section.style.marginLeft = "0px"
    }
    else{
        sidebar.style.width = "250px"
        section.style.marginLeft = "250px"
    }
}