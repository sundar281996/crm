import { useState, useContext,useEffect } from 'react';
import {useParams,Link,Routes,Route } from 'react-router-dom'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import { context, URL } from './App';

function Employeelogin() {
  const { Firstname,Lastname, Mailid, setMailid, Password, setPassword, navigate } = useContext(context);

  const [Designation, setDesignation] = useState('');
  const userdata = { Firstname, Lastname, Mailid, Password, Designation };
  const handleChange = (event) => {
    setDesignation(event.target.value);
  };
  const logIn = async (userdata) => {
    const loginresponse = await fetch(`${URL}/employeelogin`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await loginresponse.json();
    // console.log(data);
    const storedata= ()=> (loginresponse.status===200)&&localStorage.setItem("token",data.token)
    storedata()
    return loginresponse.status;
  };

  let page=()=>{
  if(userdata.Designation==="Admin")
  {
        return navigate.push('/Admindashboard')
  }
  else if(userdata.Designation==="Manager")
  {
        return navigate.push('/Managerdashboard')
  }
  else if(userdata.Designation==="Employee")
  {
        return navigate.push('/Employeedashboard')
  }
}
  return (<div>

    <input type="text" onInput={(e) => setMailid(e.target.value)} placeholder="Enter The Mailid" />
    <input type="text" onInput={(e) => setPassword(e.target.value)} placeholder="Enter The Password" />

    <Box sx={{ minWidth: 400 }}>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">User</InputLabel>
        <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth-label" value={Designation} label="user" onChange={handleChange}>
          <MenuItem value={"Admin"}>Admin</MenuItem>
          <MenuItem value={"Manager"}>Manager</MenuItem>
          <MenuItem value={"Employee"}>Employee</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* <button type="submit" onClick={() => navigate.push('/Employeesignup')}>Signup</button> */}
    <button type="submit" onClick={() => logIn(userdata).then((x) => (x === 200)?page():null)}>Login</button>
    <button type="submit" onClick={() => navigate.push('/employeeforgotpassword')}>Forgot Password</button>
  </div>);
}



 function Employeesignup() {
  const { Firstname, setFirstname, Lastname, setLastname, Mailid, setMailid, Password, setPassword, navigate } = useContext(context);
  const [Designation, setDesignation] = useState('');
  const userdata = { Firstname, Lastname, Mailid, Password, Designation };


  const handleChange = (event) => {
    setDesignation(event.target.value);
  };
  const signUp = async (userdata) => {
    const signupresponse = await fetch(`${URL}/employeesignup`, {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: { 'Content-Type': 'application/json' },
    });
    // const data = await signupresponse.json();
    // console.log(data);
    return signupresponse.status;
  };

  return (<div>

    <input type="text" onInput={(e) => setFirstname(e.target.value)} placeholder="Enter The Firstname" />
    <input type="text" onInput={(e) => setLastname(e.target.value)} placeholder="Enter The  Lastname" />
    <input type="text" onInput={(e) => setMailid(e.target.value)} placeholder="Enter The Mailid" />
    <Box sx={{ minWidth: 400 }}>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-autowidth-label">User</InputLabel>
        <Select labelId="demo-simple-select-autowidth-label" id="demo-simple-select-autowidth-label" value={Designation} label="user"
          onChange={handleChange}>
          <MenuItem value={"Admin"}>Admin</MenuItem>
          <MenuItem value={"Manager"}>Manager</MenuItem>
          <MenuItem value={"Employee"}>Employee</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <input type="text" onInput={(e) => setPassword(e.target.value)} placeholder="Enter The Password" />
    <button type="submit" onClick={() => signUp(userdata).then((x) => (x === 200) && navigate.push('/Employeelogin'))}>Get Started</button>
  </div>);
}

 function Employeeforgotpassword()
{
  const {Mailid,setMailid,navigate}=useContext(context)

  const userdata={Mailid}
 
  const forgot=async(userdata)=>{
    const forgotresponse=await fetch(`${URL}/employeeforgotpassword`,
    {
      method:"POST",
      body:JSON.stringify(userdata),
      headers:{'Content-Type':'application/json'}
    })
    // const result=await forgotresponse.json();
 
//   console.log( forgotresponse.status);
  return  forgotresponse.status
  }
  

  return(<div>
    <input type="text" onInput={(e)=>setMailid(e.target.value)} placeholder="Enter The Mailid" />
    <button type="submit" onClick={()=>{forgot(userdata).then((x)=>(x===200)&&navigate.push('/employeeupdatepassword'))}}>Submit</button>
  </div>)
}


// function Message()
// {
//   return (<div>Link sent to the mail</div>)
// }


 function Employeeredirect()
{
  const {id}=useParams()
  
  
  return ((id)?<Employeeupdatepassword id={id}/>:null)
}

function Employeeupdatepassword({id})
{

  const {navigate}=useContext(context)
   async function Result(id){
    const tokenresponse=await fetch(`${URL}/employeeforgotpassword/verify`,
    {
      method:"GET",
      headers:{'x-auth-token':id}
    })
    // const value= await tokenresponse.json()

     const result=()=>(tokenresponse.status===200)?navigate.push(`/employeenewpassword/${id}`) :null
      result()
    }
   
  
  Result(id)
 
return <div>Loading...</div>

}

  function Employeenewpassword()
{
  let {id}=useParams()
  const {navigate}=useContext(context)
  const {Password,setPassword}=useContext(context)
  const userdata={Password,token:id};
//   console.log(userdata);
  const Changepassword=async(userdata)=>{
    const passwordchangeresponse= await fetch(`${URL}/employeeupdatepassword`,
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


 function Admindashboard()
{
    return     (<div><Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div">
                
                <Button color="inherit" ><Link className="link" to="/dashboard/users">Users</Link></Button>
                <Button color="inherit"><Link className="link" to="/Admindashboardemployees">Employees</Link></Button>
                <Button color="inherit"><Link className="link" to="/Add Movies">Add Movies</Link></Button>
                </Typography>
                </Toolbar>
                </AppBar>
                </Box>
                <Routes>
                    <Route exact path="/dashboard/users"><Getusers/></Route>
                </Routes>
                </div>)
     
}




 function Getusers()
{
    const token=localStorage.getItem("token");
    // console.log(token);
    const [userdata,setUserdata]=useState([]);
    // const {navigate}=useContext(context)
    // let controller = new AbortController();

   
        const getresponse=()=>{fetch(`${URL}/getuserdata`,
        {
            method:"GET",
            headers:{'x-auth-token':token}
        }).then(x=>x.json()).then(x=>setUserdata([x]))
    return;
}
  // useEffect(()=>{ getresponse();
  //    return()=> controller.abort()},[])
 
  useEffect(getresponse,[token])

  return (<div><p>Admin dashboard</p>
  
  {userdata.map(({Firstname,Mailid,_id})=>{
      return(
          <div key={_id}>
              <p>Name:{Firstname}</p>
              <p>Mail:{Mailid}</p>
          </div>
      )
  })}
{/*  
   <button type="submit" onClick={() => navigate.push('/Employeesignup')}>Add Employee</button>
   <button type="submit" onClick={() => navigate.push('/adduser')}>Add User</button> */}
  
   
  </div>)
}



 function Managerdashboard()
{
  return <p>Manager dashboard</p>
}



 function Employeedashboard()
{
  return <p>Employee dashboard</p>
}

export {
    Employeelogin,
    Employeesignup,
    Employeeforgotpassword,
    Employeeredirect,
    Employeenewpassword,
    Admindashboard,
    Managerdashboard,
    Employeedashboard,
    Getusers,
}