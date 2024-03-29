import React, { Fragment, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_USER, VIEW_USER } from '../Queries';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toDateStr, readFile } from '../Convert';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function  Edit() {
    let history = useNavigate();
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [fr,] = useState(new FileReader());
    const [uid, setUId] = useState(0);
    const [name, setName] = useState('');  
    const [email, setEmail] = useState(''); 
    const [jobTitle, setJobTitle] = useState(''); 
    const [joiningDate, setJoiningDate] = useState('');  
    const [content, setContent] = useState(''); 
    const [initialise, setInitialise] =  useState(false);
    useEffect(() => {
        if(uid===0)
            setUId(parseInt(localStorage.getItem('id')))//set the integer value
    },[uid]);
    const {data, loading, error} = useQuery(VIEW_USER, {variables:{id:uid}});
    const [initialiseData = () => {
        if(data && data.user){
            setName(data.user.name)
            setEmail(data.user.email)
            setJobTitle(data.user.job_title)
            setJoiningDate(toDateStr(new Date(data.user.joining_date)))
            setContent(data.user.content) //content = base64 string
            setInitialise(true);
        }
    },] = useState();

    useEffect(() => {
        if(!initialise){
            initialiseData();
        }
    },[initialise, initialiseData]);

    useEffect(() => {
        (async () => {
         if(files && files[0]) {
             var result = await readFile(fr, progress, setProgress)
             .catch((err) => console.error(err));
             setContent(result);
         }})();
     },[files, fr, progress]);
    
    const [changeUser] = useMutation(EDIT_USER,)
    
    if(loading) return <Fragment>loading...</Fragment>
    if(error) return <Fragment>error...</Fragment>
    //refetch();//refetch the query when redirecting

    async function handleChange (e) {
        if(e.target && e.target.files) {
            setFiles(e.target.files);
            setProgress(0);
            fr.readAsDataURL(e.target.files[0]);
        }
    } 
    
    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b=name, c=email, d=jobTitle, f=joiningDate, g = content; 
        //sent to server
        try{
            await changeUser({variables:{id:uid, name:b, email:c, job_title:d, 
                joining_date:f, content:g}})
            history('/') //redirect to home
        }catch(error){alert("error in edit: "+error);}
    }
    
    return (
        <div>
            <Form className="d-grid gap-2" style={{marginLeft: '25em', 
                    marginRight: '25em', marginTop: '2em'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control  value={name}
                        onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" placeholder="Enter Email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJobTitle">
                    <Form.Control value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        type="text" placeholder="Enter Job Title" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJoiningDate">
                <div className="mb-3"> 
                <label for="joiningDate">Joining Date :</label>
                    <DatePicker value={joiningDate} 
                    onChange={e => setJoiningDate(toDateStr(e))} />
                </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <Form.Control onChange={async(e) => await handleChange(e)}
                    type="file" />
                </Form.Group>
                <ProgressBar now={progress} label={`${progress}%`} id="pb"></ProgressBar>
                <div>
                    <Link  to='/'>
                        <Button variant="primary" size="lg">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)
                        }variant="warning" type="submit" size="lg">
                        Update
                    </Button>
                    <img src={content} width={75} height={75} alt='' />
                </div>
            </Form>
        </div>
    )
}
export default Edit;
