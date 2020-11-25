import React, { useState, useEffect } from 'react';
import './App.css';
//import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';
//import { onCreateTodo } from './graphql/subscriptions';
import { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';
const initialFormState = { name: '', description: '', city:'Taipei'}

function App() {
  
  const [username, setUser] = useState(Auth.user.username);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
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
            </div>
            </div>
          ))
        }
      </div>


      {/* Feature post */}
      
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);