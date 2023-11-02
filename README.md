### CrudOperationGraphqlApolloReact
Demo Example provides crud operation using graphql apollo react from MySQL database using image and date field showing progres bar

Download and install mysql 8.1

create a database userapp and a table users by using following sql
```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `job_title` varchar(45),
  `content` mediumtext,
  `joining_date` date,
   PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
```
insert sample rows.

download and install node.js 

run windows powershell/ command prompt

Create a directory server under crudApp folder, change to server directory

Write the following commands in sequence :

```npm init```

```npm i @apollo/server```

```npm i express```

```npm i nodemon```

```npm i cors```

```npm i mysql2```

```npm i http```

```npm i sequelize```

```npm i graphql```

```type package.json``` (to see all the installed packages)

add following in package.json for using ES6
```json
"type": "module",
```
add following in script section of package.json for auto start of server
```
"dev": "nodemon index.js"
```
Write follwing code in index.js under server directory
```js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import http from 'http';
import {typeDefs, resolvers} from './Graphql/users.js';
import db from './database.js';

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(cors());
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({DB:db}),
  }),
);

new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
```
Write follwing code in database.js under server directory
```js
'use strict';
import userModel from './models/users.js';
import Sequelize from 'sequelize';
import  Config from './config.js';
const config = Config.development;
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false,
})

const seqModel = userModel(sequelize, Sequelize)
db[seqModel.name] = seqModel
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
```
Write follwing code in config.js under server directory
```js
const Config = {
    "development": {
      "username": "root",
      "password": "root",
      "database": "userapp",
      "host": "localhost",
      "dialect": "mysql",
      "port":"3036"
    },
  };
  
  export default Config;
```
create two folders ```models``` and ```Graphql``` under server directory

Write follwing code in users.js under Graphql folder
```js
import { GraphQLScalarType, Kind} from 'graphql';
 
const resolverDate = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value // ast value is always in string format
      }
      return null;
    },
    extensions: {
      codegenScalarType: 'Date | string',
      jsonSchema: {
        type: 'string',
        format: 'date',
      },
    },
  }),
};
  
 export const typeDefs = `
    scalar Date
    type Query {
        users: [User]
        user(id: Int): User
    }
    type User {
        id: Int
        email: String
        name: String
        job_title:String
        joining_date:Date
        content:String
    }
    type Mutation {
      updateUser(id: Int, name: String, email: String, job_title: String, 
        joining_date: Date, content: String): User,
      createUser(name: String, email: String, job_title: String, joining_date: Date, 
        content: String): User,
      deleteUser(id: Int): Int
    }
`;

export const resolvers = {
  Query: {
    users: async (obj, args, context) => context.DB.users.findAll(),
    user: async (obj, args, context) => context.DB.users.findByPk(args.id)
  },  

  Mutation: {
    createUser : async (obj, args, context) => {
      try {
        return await context.DB.users.create({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date, 
          content:args.content,
          });
      } catch (err) {alert(err);}
    },  

    deleteUser : async(obj, args, context) => {
      try {
        return await context.DB.users.destroy({
          where: { id:args.id }
        });
      } catch (err) {alert(err)}
    },  

    updateUser : async(obj, args, context) => {
      try {
        return await context.DB.users.update({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date,
          content:args.content},
          {where: { id:args.id }
        });
      } catch (err) {alert(err);}
    }
  }
};
```
Write follwing code in users.js under models folder
```js
'use strict';

const userModel = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
    	job_title: DataTypes.STRING,
    	joining_date: DataTypes.DATE,
    	content: DataTypes.TEXT('medium'),
		}, {
		tableName: 'users',
		timestamps: false
	});
}

export default userModel;
```
type ```npm run dev``` to check if the server is running correctly

you can test the queries and mutations by browsing 
```
http://localhost:4000/graphql
```

![image](https://github.com/beheradotabhiram2009/CrudOperationGraphqlApolloReact/assets/25347074/2328b736-97bd-4d33-b274-07a330360bbf)

![image](https://github.com/beheradotabhiram2009/CrudOperationGraphqlApolloReact/assets/25347074/5b1a2595-950b-408d-bc21-22ac9f0e7bfb)

![image](https://github.com/beheradotabhiram2009/CrudOperationGraphqlApolloReact/assets/25347074/f427667e-819b-4850-b190-7c903fe62f9a)

To create react client application type this command under crudApp folder
```
npx create-react-app client
```
ignore the errors change to client directory

Write the following commands in sequence :

```npm i @apollo/client```

```npm i react-router-dom```

```npm i react-bootstrap```

```npm i bootstrap```

```npm i react-datepicker```

```type package.json``` (to see all the installed packages)

Write following code in index.js under src folder
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
```
Write following code in App.js under src folder
```js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Create from './Components/Create';
import Edit from './Components/Edit';
import Home from './Components/Home'
  
function App() {
    return (
        <div className='App'>
              <Router>
                <Routes>
                    <Route path='/' 
                        element={<Home />} />
                    <Route path='/create' 
                        element={<Create />} />
                    <Route path='/edit' 
                        element={<Edit />} />
                </Routes>
            </Router>
        </div>
    );
}
export default App;
```
create a folder ```Queries``` under src folder

write following code in index.js under Queries foalder
```js
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  {
    users{
      id,
      name,
      email,
      job_title,
      joining_date,
      content,
      }
  }
`;

export const VIEW_USER = gql`
  query ($id: Int){
    user(id: $id) {
      id,
      name,
      email,
      job_title,
      joining_date,
      content,
      }
  }
`;

export const ADD_USER = gql`
  mutation($name: String, $email: String, $job_title: String, 
    $joining_date: Date, $content: String) {
    createUser (name: $name, email: $email, job_title: $job_title, 
      joining_date: $joining_date, content: $content)
    {
      id
      name
      email
      job_title
      joining_date
      content
    }
  }
`;

export const EDIT_USER = gql`
  mutation($id: Int, $name: String, $email: String, $job_title: String, 
    $joining_date: Date, $content: String) {
    updateUser(id: $id, name: $name, email: $email, job_title: $job_title, 
      joining_date: $joining_date, content: $content)
    {
      id
      name
      email
      job_title
      joining_date
      content
      }
  }
`;

export const DELETE_USER = gql`
  mutation($id: Int) {
    deleteUser(id: $id)
  }
`;
```
create a folder ```Compnents``` under src folder

write following code in Home.js under Components folder
```js
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
```
write following code in Create.js under Components folder
```js
import React, { useState, useEffect } from 'react'
import { ADD_USER } from '../Queries';
import { useMutation } from '@apollo/client';
import { Button, Form, ProgressBar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toDateStr } from '../Convert';

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
            
    const [loadPromise = async ()=> {
        return new Promise((resolve, reject) => { 
            fr.onerror = (err) => reject(err);  
            fr.onload = () => resolve(fr.result);
            fr.onprogress = (event) => {
                setTimeout(()=>{
                    var pr = Math.round(100*(event.loaded / event.total));
                    if (pr > progress && pr <= 100) {setProgress(pr);}            
                },1);
            }      
        });
    },] = useState();
    
    useEffect(() => {
       (async () => {
        if(files && files[0]) {
            var result = await loadPromise();
            setContent(result);
        }})();
    },[files, loadPromise]);

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
```
write following code in Edit.js under Components folder
```js
import React, { Fragment, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_USER, VIEW_USER } from '../Queries';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toDateStr } from '../Convert';

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

    const [loadPromise = async ()=> {
        return new Promise((resolve, reject) => { 
            fr.onerror = (err) => reject(err);  
            fr.onload = () => resolve(fr.result);
            fr.onprogress = (event) => {
                setTimeout(()=>{
                    var pr = Math.round(100*(event.loaded / event.total));
                    if (pr > progress && pr <= 100) {setProgress(pr);}            
                },1);
            }      
        });
    },] = useState();

    useEffect(() => {
        (async () => {
            if(files && files[0]) {
                var result = await loadPromise();
                setContent(result);
            }
        })();
    },[files, loadPromise]); 

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
```
write following code in Convert.js under src folder
```js
//file to base64
export const fileToBase64 =(file, callback) =>{
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.onerror = (error) => {
        alert('Load Error: '+ error);
    };
    reader.readAsDataURL(file);
};

//to set the date
export const toDateStr=(dt)=>{
    const m = dt.getMonth()+1;
    return (dt.getFullYear() + '-' + m + '-' + dt.getDate());
};
```
type ```npm start``` to test the crud operation 
