import { gql } from '@apollo/client';

export const GET_USERS = gql`
  {
    users{
      id,
      name,
      email,
      job_title,
      joining_date,
      content
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
      content
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
