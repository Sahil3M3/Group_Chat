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
sessionStorage.setItem('token',r.data.token);
window.location.href="http://localhost:5500/Frontend/chat.html"
 })
 .catch(e=>{

   console.log(e.response.data.message);
   
   const div=document.getElementById('mydiv');
   div.innerHTML=`<p>${e.response.data.message}</p>`
 }
 )
}