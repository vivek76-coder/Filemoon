const sidebar = document.getElementById("sidebar");

const toggleSidebar = () => {
  const sidebarWidth = sidebar.style.width;
  if (sidebarWidth === "250px") {
    sidebar.style.width = "0px";
  } else {
    sidebar.style.width = "250px";
  }
};
