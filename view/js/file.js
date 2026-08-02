axios.defaults.baseURL = SERVER;

const checkSession = async () => {
  const session = await getSession();
  if (!session) location.href = "/login";
};
checkSession();
const drawer = document.getElementById("drawer");

const toggleDrawer = () => {
  const rightValue = drawer.style.right;

  if (rightValue === "0%") {
    drawer.style.right = "-33.33%";
  } else {
    drawer.style.right = "0%";
  }
};

const uploadFile = async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new formData(form);
  const { data } = await axios.post("api/files", formData);
  console.log(data);
};
