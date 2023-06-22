// import logo from './logo.svg';
import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Routes} from "react-router-dom";
import {v4 as uuid} from 'uuid';
import api from '../api/contacts';
import Header from "./Header";
import AddContact from "./AddContact";
import EditContacts from "./EditContacts";
import ContactList from "./ContactList";
import ContactDetails from './ContactDetails';
// import './App.css';

function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState("");

const retriveContacts = async () => {
  const response = await api.get('/');
  return response.data;
};

const addContactHandler = async (contact) =>{
  console.log(contact);
  const request = {
    id: uuid(),
    ...contact,
  }
  
  const response = await api.post("/", request);
  console.log(response);
  setContacts([...contacts, response.data]);
};

const updateContactHandler = async (contact) => {
  const response = await api.put(`/${contact.id}`, contact)
  console.log(response.data);
  const {id,name,email}=response.data;
  setContacts(
    contacts.map((contact)=>{
    return contact.id === id ? { ...response.data} : contact;
  })
  );
};
const removeContactHandler = async (id) => {
  await api.delete(`/${id}`);
  const newContactList = contacts.filter((contact) => {
    return contact.id !== id;
  });
  setContacts(newContactList); 
};

const searchHandler = (searchTerm) => {
  // console.log(searchTerm);
  setSearchTerm(searchTerm);
  if(searchTerm !== ""){
    const newContactList = contacts.filter((contact) => {
    return  Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    }) ;
    setSearchResults(newContactList);
  }
  else{
    setSearchResults(contacts);
  }
};
useEffect(() => {
  // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  // if (retriveContacts){
  //    setContacts(retriveContacts);
  const getAllContacts = async () => {
    const allContacts = await retriveContacts();
    if(allContacts) setContacts(allContacts);
  };
  getAllContacts();
}, []);
  
useEffect(() => {
  // if(contacts.length > 0) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
}, [contacts]);
  
  return (
    <div className = "ui container">
      <Router>
      <Header />
      <Switch>
      {/* <Routes> */}
      <Route path="/"
      exact 
      render={(props) => (
      <ContactList
      {...props}
      contacts={searchTerm.length < 1 ? contacts : searchResults}
      getContactId={removeContactHandler}
      term={searchTerm}
      searchKeyword = { searchHandler }
      />
      )}
      />
      <Route 
      path="/add" 
      render={(props)=>(
        <AddContact {...props} addContactHandler={addContactHandler} />
  )}
      />
      {/* </Routes> */}
      <Route path="/contact/:id" component = {ContactDetails}/>

      <Route 
      path="/edit" 
      render={(props)=>(
        <EditContacts {...props} updateContactHandler={updateContactHandler} />
  )}
      />
      {/* </Routes> */}
      <Route path="/contact/:id" component = {ContactDetails}/>
      </Switch>
      {/* <AddContact addContactHandler = {addContactHandler}/>
      <ContactList contacts = {contacts} getContactId = {removeContactHandler} /> */}
      </Router>

    </div>
  );
}

export default App;
