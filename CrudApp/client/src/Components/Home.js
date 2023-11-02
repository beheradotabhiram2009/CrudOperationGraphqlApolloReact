import React from "react";
import { useMutation, useQuery } from '@apollo/client';
import { Table, Button} from 'react-bootstrap';
import { useNavigate , Link} from 'react-router-dom';
import {GET_USERS, DELETE_USER} from "../Queries"

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
	const navigate = useNavigate();

	const allusers = useQuery(GET_USERS,);
	const [ deleteUser ] = useMutation(DELETE_USER,);

	allusers.refetch();//refetch the query when redirecting
	
	const handleDelete = async (userid) => {
		const resp = window.confirm("Are you sure to delete this User?");
		if (!resp) return;
		try{
			await deleteUser({variables:{id:userid}});
			navigate('/');
		}catch(error){alert(error)}
	}
	function setUserId(uid){
		localStorage.setItem('id', uid);//string value is stored
	}
	
	return (
		<div style={{marginLeft: '5em', marginRight: '5em'}}>
			 {/* <p>{JSON.stringify(allusers.data, null, 2)}</p> */}
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>JobTitle</th>
						<th>EMail</th>
						<th>Joining Date</th>
						<th>Photo</th>
						<th>Change</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{allusers.error ? alert(allusers.error) : null}
					{allusers.data?allusers.data.users.map((user, index) => (
						<tr key={index}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.job_title}</td>
							<td>{user.email}</td>
							<td>{new Date(user.joining_date).toDateString()}</td>
					    	<td><img src= {user.content} 
								width={50} height={50} alt='' /></td>
							<td>
								<Link to={`/edit`}>
									<Button onClick={(e) =>{
									//alert(user.id)
									setUserId(user.id)
									}}variant="info" size="sm">Update</Button>
								</Link>
							</td>
							<td>
					  			<Button onClick={async (e) => 
								await handleDelete(user.id)
								}variant="danger" size="sm">Delete</Button>
							</td>
						</tr>
					)):null}
				</tbody>
			</Table>
			<Link  to='/create'>
                <Button variant="primary" size="md">Create</Button>
            </Link>
		</div>
	);
}	
export default Home;
