import React, { useState, useEffect } from 'react'
import { ADD_USER } from '../Queries';
import { useMutation } from '@apollo/client';
import { Button, Form, ProgressBar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import  { readFile, toDateStr } from '../Convert';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const  Create = () => {
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [fr,]=useState(new FileReader());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [content, setContent] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
           
    let history = useNavigate();
    const [ addUser ] = useMutation(ADD_USER,);
            
    useEffect(() => {
       (async () => {
        if(files && files[0]) {
            var result = await readFile(fr, progress, setProgress)
            .catch((err) => console.error(err));
            setContent(result);
        }})();
    },[files, fr, progress]);

    const handleChange = async (e) =>{
        if(e.target && e.target.files) {
            setFiles(e.target.files);
            setProgress(0);
            fr.readAsDataURL(e.target.files[0]); 
        }
    } 
    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b = name, c=email, d=jobTitle, f=joiningDate, g=content;  
        //sent to server
        try{
            await addUser({variables:{name:b, email:c, job_title:d, 
                joining_date:f, content:g}});
            history('/'); //redirect to home
        }catch(error){alert('Add Error: '+error)}
    }
    return (
        <div >
            <Form className="d-grid gap-2" 
                style={{marginLeft: '25em', marginRight: '25em', marginTop: '2em'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" required />
                </Form.Group>
                 <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control onChange={e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJobTitle">
                    <Form.Control onChange={e => setJobTitle(e.target.value)}
                        type="text" placeholder="Enter Job Title" required />
                </Form.Group>
                <Form.Group className="mb-3"  controlId="formBasicJoiningDate">
                <div className="mb-3"> 
                    <label for="joiningDate">Joining Date :</label>
                        <DatePicker value={joiningDate} 
                        onChange={e => setJoiningDate(toDateStr(e))} />
                </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <input onChange={async (e) => await handleChange(e)}
                        type="file" accept=".jpg, .jpeg, .png, .mp4, .webm" />
                </Form.Group>
                <ProgressBar now={progress} label={`${progress}%`} id="pb"></ProgressBar>
                <div>
                    <Link to='/'>
                        <Button variant="info" size="md">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)}
                        variant="primary" type="submit">
                        Submit
                    </Button>
                    <img src={content} width={75} height={75} alt='' />
                </div>
            </Form>
        </div>
    )
}
 export default Create
