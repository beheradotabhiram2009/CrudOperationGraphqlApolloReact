import React, { useState } from 'react'
import { ADD_USER } from '../Queries';
import { useMutation } from '@apollo/client';
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toDateStr, fileToBase64 } from '../Convert';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Create() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [content, setContent] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [mime, setMime] = useState('');

    let history = useNavigate();
    const [ addUser ] = useMutation(ADD_USER,);

    const changeContent = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setMime('image/'+file.name.split('.')[1]);
            fileToBase64(file, function(base64Data){
                console.log(base64Data);
                setContent(base64Data.split(',')[1]);
            })
        }
    }

    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent 
        let b = name, c=email, d=jobTitle, f=joiningDate, g=content,
        h=mime;  //sent to server
        try{
            await addUser({variables:{name:b, email:c, job_title:d, 
                joining_date:f, content:g, mime:h}})
            history('/') //redirect to home
        }catch(error){alert('Add Error: '+error)}
    }
    return (
        <div >
            <Form className="d-grid gap-2" style=
                {{marginLeft:'25rem', marginRight:'25em', marginTop:'2rem'}}>
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
                    <input onChange={(e)=>
                        {if(e.target && e.target.files) changeContent(e)}}
                        type="file" accept=".jpg, .jpeg, .png"/>
                </Form.Group>
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
                    <img src={'data:'+mime+';base64,'+content} 
                        width={75} height={75} alt='' />
                </div>
            </Form>
        </div>
    )
}
  
export default Create