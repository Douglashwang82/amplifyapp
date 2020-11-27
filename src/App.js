import React, { useState, useEffect } from 'react';
import './App.css';
//import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos, listUserss } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';
//import { onCreateTodo } from './graphql/subscriptions';
import { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';
//User mission
import { createUsers  as createUsersNoteMutation, deleteUsers as deleteUsersNoteMutation, updateUsers as updateUsersNoteMutation} from './graphql/mutations';
const initialFormState = { name: '', description: '', city:'Taipei'}


function App() {
  
  const [username, setUser] = useState(Auth.user.username);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  // User notes
  const [userNotes, setUsersNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
    fetchUsersNote();
  }, []);


  async function fetchNotes() {
    const apiData = await API.graphql({ query: listTodos });
    const notesFromAPI = apiData.data.listTodos.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(notesFromAPI);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
  }

  //image
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    formData.image = file.name
    setFormData({ ...formData});
    await Storage.put(file.name, file);
    fetchNotes();
  }


  //save into user database
  async function fetchUsersNote() {
    const apiData = await API.graphql({ query: listUserss });
    const notesFromAPI = apiData.data.listUserss.items;
    setNotes(notesFromAPI);
  }
  
  async function createUsersNote( { id , name}) {
    console.log(name);
    let noteinfo = {
        mission_id: id,
        mission_topic: name,
        percentage: 0
      }
    await API.graphql({ query: createUsersNoteMutation, variables: { input: noteinfo } });
    setUsersNotes([...userNotes, noteinfo]);
  }

  async function deleteUsersNote( {id }) {
    const newUsersNotesArray = userNotes.filter(note => note.id !== id);
    setUsersNotes(newUsersNotesArray);
    await API.graphql({ query: deleteUsersNoteMutation, variables: { input: { id } } });
  }
  
  async function updateUsersNote( { id , per}) {
    let formData = {
      id: id,
      percentage:per
    }
    await API.graphql({ query: updateUsersNoteMutation, variables: { id, input: formData } });
    fetchUsersNote();
  }

  //------------------------------------------------------------------HTML
  return (
    <div className="App">
      <h1>Travel Mission</h1>
      <h2> Username: {username}</h2>
      <div className='container'>
      <h2>AddMission</h2>
        <div className = "inputfield">
          <label>Topic of Mission: </label>
          <input
            onChange={e => setFormData({ ...formData, 'name': e.target.value })}
            placeholder="Note name"
            value={formData.name}
          />
        </div>
        <div className = "inputfield">
          <label>City: </label>
          <select name = "citys" id = "citys" defaultValue = "California" 
          onChange={e => setFormData({ ...formData, 'city': e.target.value })}>
            <option>Taipei</option>
            <option>California</option>
            <option>Kingmen</option>
          </select>
        </div>
        <div className = "inputfield">
          <label>Steps: </label>
          <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value })}
            placeholder="Note description"
            value={formData.description}
          />
        </div>
        <div>
          <label>Image: </label>
          <input
            type="file"
            onChange={onChange}
          />
        </div>
        <div className = "inputfield">
          <button onClick={createNote}>Create Mission</button>
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
      <h2>All Posts</h2>
        {
          notes.map(note => (
            <div className = "container">
            <div className = "post" key={note.id || note.name}>
              <h2>Topic: {note.name}</h2>
              <p>City: {note.city}</p>
              <p>Steps: {note.description}</p>
              
              {
                // eslint-disable-next-line
                note.image && <img src={note.image} style={{ width: 400 }} />
              }
              <button onClick={() => deleteNote(note)}>Delete Mission</button>
              <button onClick={() => createUsersNote(note)}>Add Mission</button>
            </div>
            </div>
          ))
        }
      </div>
    

      {/* Feature post */}
      
      <div style={{ marginBottom: 30 }}>
      <h2> Mission Taken</h2>
      {
          userNotes.map(note => (
            <div className = "container">
            <div className = "post" key={note.id || note.mission_topic}>
              <h2>Topic: {note.mission_topic}</h2>
              <p>id: {note.id}</p>
              <p>mission_id: {note.mission_id}</p>
              <p>Complete rate: {note.percentage} %</p>
              <button onClick={() => deleteUsersNote(note)}>Delete Mission</button>
            </div>
            </div>
          ))
        }
      </div>
      
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);