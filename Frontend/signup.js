async function handleSubmit(e)
{
    e.preventDefault();
    const name=document.getElementById("name").value;
    const email=document.getElementById('email').value;
    const phone=document.getElementById('phone').value;
    const password=document.getElementById('password').value;

    const user={
        name:name,
        email:email,
        phone:phone,
        password:password
    }
console.log(user);

axios.post('http://localhost:5000/signup',user)
.then(r=>{
    console.log(r.data);
    window.location.href='http://localhost:5500/Frontend/login.html'    
}).catch(e=>console.log(e.response))
alert("User already Exist")

}