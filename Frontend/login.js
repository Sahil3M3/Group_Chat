async function handleLogin(e){
 e.preventDefault();
 const email=document.getElementById('email').value;
 const password=document.getElementById('password').value;

 const user={
    email:email,
    password:password
 }
    
 axios.post("http://localhost:5000/login",user)
 .then(r=>{
console.log(r.data);

 })
 .catch(e=>console.log(e)
 )
}