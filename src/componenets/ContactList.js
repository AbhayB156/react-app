import React, { useRef } from "react";
import {Link} from 'react-router-dom'
import ContactCard from "./ContactCard";

const ContactList = (props) => {
    console.log(props);
    const inputEl = useRef("");
    const deleteContactHandler = (id) => {
        props.getContactId(id);
    };
    // const contacts = [{
    //     id: "1",
    //     name: "Abhay",
    //     email: "abhay"
    // }]
    
    const renderContactList = props.contacts.map((contact) => {
        return (
            <ContactCard contact={contact} clickHandler = {deleteContactHandler} key = {contact.id} />
        );
    });
    const getSearchTerm = () => {
        // console.log(inputEl.current.value);
        props.searchKeyword(inputEl.current.value);
    };
    return( <div className = "ui main"><h1></h1><h2>
        Contact List
        <Link to = "/add">
        <button className= "ui button blue right">Add Contact</button>
        </Link></h2>
        <div className = "ui search">
            <div className = "ui icon">
                <input ref = {inputEl} type="text" placeholder = "Search Contacts" className = "prompt" value = {props.term} onChange = {getSearchTerm}/>
                <i className="search icon"></i>
            </div>
        </div>
        <div className="ui celled list">{renderContactList}</div></div>
    );
};
 
export default ContactList;