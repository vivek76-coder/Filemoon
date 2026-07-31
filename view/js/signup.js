const toast = new Notyf({
  position: { x: "center", y: "top" },
});

const signup = async (e) => {
    try{
        e.preventDefault();
        const form = e.target
        const elements = form.elements
        const payload = {
            fullname: elements.fullname.value,
            mobile: elements.mobile.value,
            email: elements.email.value,
            password: elements.password.value
        }
       
        const {data} = await axios.post('http://localhost:8080/signup', payload)
        toast.success(data.message)
    }
    catch(err){
        toast.error(err.response ? err.response.data.message : err.message)
    }

};
