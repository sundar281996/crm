import './App.css';
import {useState,useContext,createContext} from 'react'
import {useNavigate,Route,Routes,useParams } from 'react-router-dom'

import {
  Employeelogin,
  Employeesignup,
  Employeeforgotpassword,
  Employeeredirect,
  Employeenewpassword,
  Admindashboard,
  Managerdashboard,
  Employeedashboard,
} from "./Employee"

export default  function App() {
  return (
    <div className="App">
      <Password/>
    </div>
  );
}

// export const URL=`http://localhost:2000/users`;
export const URL='https://sundar-crm.herokuapp.com/';
export const context=createContext('')
function Password()
{
  const[Firstname,setFirstname]=useState('');
  const[Lastname,setLastname]=useState('');
  const[Mailid,setMailid]=useState('');
  const[Password,setPassword]=useState('');
  let navigate=useNavigate();
  const obj={Firstname,setFirstname,Mailid,Lastname,setLastname,setMailid,Password,setPassword,navigate}
  return(<div className="container">
      <context.Provider value={obj}>
      <Routes>
        <Route exact path='/'><Userlogin/></Route>
        <Route exact path='/userlogin'><Userlogin/></Route>
        <Route exact path='/Dashboard'><Dashboard/></Route>
      
        <Route exact path='/forgotpassword'><Forgotpassword/></Route>
        <Route path='/updatepassword'><Message/></Route>
        <Route path='/forgotpassword/verify/:id'><Redirect/></Route>
        <Route path='/newpassword/:id'><Newpassword/></Route>

        <Route path='/Employeesignup'><Employeesignup/></Route>
        <Route exact path='/Employeelogin'><Employeelogin/></Route>

        <Route exact path='/Employeeforgotpassword'><Employeeforgotpassword/></Route>
        <Route path='/employeeupdatepassword'> <Message/> </Route> 
        <Route path='/employeeforgotpassword/verify/:id'><Employeeredirect/></Route>
        <Route path='/employeenewpassword/:id'><Employeenewpassword/></Route>
        
        <Route path='/Admindashboard'><Admindashboard/></Route>
        <Route exact path='/adduser'><Usersignup/></Route>
        <Route path='/Managerdashboard'><Managerdashboard/></Route>
        <Route path='/Employeedashboard'><Employeedashboard/></Route>

        {/* <Route exact path='/Admin/dashboard/users'><Getusers/></Route> */}

        <Route path='/final'><Endpage/></Route>
        <Route path="**">NOT FOUND</Route>
        </Routes>
        </context.Provider>
  </div>)
}


function Usersignup()
{

  const {Firstname,setFirstname,Lastname,setLastname,Mailid,setMailid,Password,setPassword,navigate}=useContext(context)
  const userdata={Firstname,Lastname,Mailid,Password};
  // console.log(userdata);


  const signUp = async (userdata) => {
    const signupresponse = await fetch(`${URL}/signup`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { "Content-Type": "application/json" },
    }).then((x)=>x.json())
    // const data=await signupresponse.json()
    // console.log(data);  
    return signupresponse.status
  };
  
 

 
  return (
    <div>
      <input type="text" onInput={(e)=>setFirstname(e.target.value)} placeholder="Enter The Firstname" />
      <input type="text" onInput={(e)=>setLastname(e.target.value)} placeholder="Enter The  Lastname" />
      <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>signUp(userdata).then((x)=>(x===200)&&navigate.push('/userlogin'))}>Submit</button>
      {/* <button type="submit" onClick={()=>navigate.push('/userlogin')}>Login</button> */}
     
     
    </div>
  );
}


function Userlogin()
{

  const {Mailid,setMailid,Password,setPassword,navigate}=useContext(context)
  const userdata={Mailid,Password};
  const logIn = async (userdata) => {
    const loginresponse = await fetch(`${URL}/login`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers:{'Content-Type': 'application/json'},
    });
    const data=await loginresponse.json()
    const {token}=data
    // console.log(data.token);

    const storedata= ()=> (loginresponse.status===200)&&localStorage.setItem("token",token)
    storedata()
    return loginresponse.status
  };
  
  return (<div>
    <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
      <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
      <button type="submit" onClick={()=>logIn(userdata).then((x)=>(x===200)&&navigate.push('/Dashboard'))}>Login</button>
      <button type="submit" onClick={()=>navigate.push('/forgotpassword')}>Forgot Password</button>
      <button type="submit" onClick={()=>navigate.push('/Employeelogin')}>Employee Portal</button>
  </div>)
}



function Forgotpassword()
{
  const {Mailid,setMailid,navigate}=useContext(context)

  const userdata={Mailid}
 
  const forgot=async(userdata)=>{
    const forgotresponse=await fetch(`${URL}/forgotpassword`,
    {
      method:"POST",
      body:JSON.stringify(userdata),
      headers:{'Content-Type':'application/json'}
    })
    // const result=await forgotresponse.json();
  //  const data= (result)?Token(result):null
  // console.log( forgotresponse.status);
  return  forgotresponse.status
  }
    // function Token(result)
    // {
    //   let {token}=result
      
    // }

  return(<div>
    <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
    <button type="submit" onClick={()=>{forgot(userdata).then((x)=>(x===200)&&navigate.push('/updatepassword'))}}>Submit</button>
  </div>)
}


export function Message()
{
  return (<div>Link sent to the mail</div>)
}


function Redirect()
{
  const {id}=useParams()
  
  
  return ((id)?<Updatepassword id={id}/>:null)
}

function Updatepassword({id})
{

  const {navigate}=useContext(context)
   async function Result(id){
    const tokenresponse=await fetch(`${URL}/forgotpassword/verify`,
    {
      method:"GET",
      headers:{'x-auth-token':id}
    })
    // const value= await tokenresponse.json()

     const result=()=>(tokenresponse.status===200)?navigate.push(`/newpassword/${id}`) :null
      result()
    }
   
  
  Result(id)
 
return <div>Loading...</div>

}

function Newpassword()
{
  let {id}=useParams()
  const {navigate}=useContext(context)
  const {Password,setPassword}=useContext(context)
  const userdata={Password,token:id};
  // console.log(userdata);
  const Changepassword=async(userdata)=>{
    const passwordchangeresponse= await fetch(`${URL}/updatepassword`,
    {
      method:"POST",
      body  :JSON.stringify(userdata),
      headers:{"Content-Type":"application/json"}
    })
    // const result=await passwordchangeresponse.json();
    const page=()=>(passwordchangeresponse.status===200)?navigate.push('/final'):null
      page()
  }
 
  
  return (<div>
    <input type="text" onInput={(e)=>setPassword(e.target.value)} placeholder="Enter The Password" />
    <button type="submit" onClick={()=>Changepassword(userdata)}>Update Password</button>
  </div>) 
}


function Endpage()
{
  return <p>Password Changed Successfully</p>
}



function Dashboard()
{
 return <div>Dashboard</div>  
}
