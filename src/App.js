import React, { useState, useEffect } from 'react';
import './App.css';
//import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes, listUserms, listGoals } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
//import { onCreateTodo } from './graphql/subscriptions';
import { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';
//User mission
import { createUserm  as createUsermNoteMutation, deleteUserm as deleteUsermNoteMutation, updateUserm as updateUsermNoteMutation} from './graphql/mutations';

//Goal 
import {createGoal as createGoalMutation, deleteGoal as deleteGoalMutation, updateGoal as updateGoalmutation} from './graphql/mutations';

const initialFormState = { name: '', description: '', city:'Taipei'}
const initialGoals =[{name:"Test",mission_id:["1","2"],mission_topic:["test1","test2"],percentage:"F"}]
const initialGoalFormState = {name:'',mission_id:[],mission_topic:[],percentage:"F"}
const initialCheckBox = [];

function App() {
  
  const [username, setUser] = useState(Auth.user.username);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  // User notes
  const [userNotes, setUsermNotes] = useState([]);

  //Goal list
  const [goals, setGoals] = useState([]);
  const [goalFormData, setGoalFormData] = useState(initialGoalFormState);
  const [checkboxform, setCheckBox] = useState([]);
  const [completedGoals, setCompleteGoals] = useState([]);

  useEffect(() => {
    fetchNotes();
    fetchUsermNote();
    fetchGoals();
  }, []);


  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
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
    console.log(id);
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
  async function fetchUsermNote() {
    const apiData = await API.graphql({ query: listUserms });
    const notesFromAPI = apiData.data.listUserms.items;
    setUsermNotes(notesFromAPI);
  }
  
  async function createUsermNote( { id , name}) {
    console.log(name);
    let noteinfo = {
        mission_id: id,
        mission_topic: name,
        percentage: "False"
      }
    console.log("h")
    await API.graphql({ query: createUsermNoteMutation, variables: { input: noteinfo } });
    console.log("s")
    setUsermNotes([...userNotes, noteinfo]);
  }

  async function deleteUsermNote( {id }) {
    const newUsermNotesArray = userNotes.filter(note => note.id !== id);
    setUsermNotes(newUsermNotesArray);
    await API.graphql({ query: deleteUsermNoteMutation, variables: { input: { id } } });
  }
  
  async function updateUsermNote({id}) {
    fetchUsermNote();
    let percentage = "True";
    await API.graphql({ query: updateUsermNoteMutation, variables: {input: { id, percentage }}  });
    console.log("out update");
    fetchUsermNote();
  }

  
  // Goal approach

  async function fetchGoals(){
    const apiData = await API.graphql({ query: listGoals });
    const goalsFromAPI = apiData.data.listGoals.items;
    setGoals(goalsFromAPI);
  }

  async function createGoal(){
    if (!goalFormData.name) return;
    await API.graphql({ query: createGoalMutation, variables: { input: goalFormData } });
    console.log(goalFormData);
    fetchGoals();
    setGoalFormData(initialGoalFormState);
    setCheckBox(initialCheckBox);
    document.getElementsByName("mission_checkbox").forEach(element => {
      element.checked = false;
    
    });
      }
  
  
  async function deleteGoal({id}){
    await API.graphql({ query: deleteGoalMutation, variables: { input: { id } } });
    fetchGoals();
  }
  async function updateGoal({id ,name}){
    fetchGoals();
    let percentage = "True";
    await API.graphql({ query: updateGoalmutation, variables: {input: { id, percentage }}  });
    console.log("out update");
    fetchGoals();
    completedGoals.push(name);
    console.log(completedGoals);
    setCompleteGoals(completedGoals);
  }

  function test(length,ar1,ar2)
  {
    var i;
    let newar =[];
    for (i = 0; i < length; i++)
  {
   newar.push([ar1[i],ar2[i]]);
  }
  return (
    <div>
      {newar.map(note =>(
        <div className = "grid-container">
        {/* <div className = "grid-item">
        <p hidden>Mission_id:{note[0]}</p>
        </div> */}
        <div className = "grid-item">
        <p>Mission_topic:{note[1]}</p>
        </div>
        </div>
      ))}
    </div>
  )
  }

  function getCheckBox(){
    let newarray = [];
    let topic = [];
    let id = [];
    document.getElementsByName("mission_checkbox").forEach(element => {
      if (element.checked) {
        newarray.push(element.value)
      }
    
    });
    newarray.forEach(e => {
      let res = e.split(",");

      id.push(res[0]);
      topic.push(res[1]);
    })
    setCheckBox(newarray);
    setGoalFormData({...goalFormData,mission_id:id, mission_topic : topic})

  }


  //------------------------------------------------------------------HTML
  return (
    <div className="App">
      <h1>Deep Travel</h1>
      <h4> Username: {username}</h4>
      <div className = 'container'>
      <h3>Completed Goals</h3>
      {
        completedGoals.map(e => (
          <p>{e}</p>
        ))
      }
      </div>
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
              <h3>Topic: {note.name}</h3>
              <p>City: {note.city}</p>
              <p>Steps: {note.description}</p>
              <p hidden>Mission Id: {note.id}</p>
              
              {
                // eslint-disable-next-line
                note.image && <img src={note.image} style={{ width: 400 }} />
              }
              <button onClick={() => deleteNote(note)}>Delete Mission</button>
              <button onClick={() => createUsermNote(note)}>Add Mission</button>
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
              <h3>Topic: {note.mission_topic}</h3>
              <p hidden>id: {note.id}</p>
              <p hidden>mission_id: {note.mission_id}</p>
              <p>Complete: {note.percentage} </p>
              <button onClick={() => updateUsermNote(note)}>Complete Mission</button>
              <button onClick={() => deleteUsermNote(note)}>Delete Mission</button>
            </div>
            </div>
          ))
        }
      </div>

      {/* Goal */}
      {/* Goal Adding */}
      <div className='container'>
      <h2>Add Goal</h2>
        <div className = "inputfield">
          <label>Topic of Goal: </label>
          <input
            onChange={e => setGoalFormData({ ...goalFormData, 'name': e.target.value })}
            placeholder="Goal name"
            value={goalFormData.name}
          />
        </div>
        <div className = "inputfield">
          <label>Mission: </label>
          {
            notes.map(e=>(
            //<input type="checkbox" value ={e.mission_topic}><label>{e.mission_topic}</label></input>
            <div>
            <input type="checkbox" name ="mission_checkbox" value = {[e.id,e.name]} onChange = {getCheckBox}></input>
            <label>{e.name}</label>
            </div>
            ))
          }
        </div>
        <div className = "inputfield">
          <button onClick={createGoal}>Create Mission</button>
        </div>
      </div>

      {/* Goal list */}
      <div style={{ marginBottom: 30 }}>
        <h2>Goal list</h2>
          {
          goals.map(goal => (
            <div className = "container">
            <div className = "post" key={goal.id}>
              <h3>Topic: {goal.name}</h3>
              <div>
              
              {
                test(goal.mission_id.length,goal.mission_id,goal.mission_topic)
              }
              <p>Complete: {goal.percentage}</p>
              </div>
              <button onClick={() => updateGoal(goal)}>Complete Goal</button>
              <button onClick={() => deleteGoal(goal)}>Delete Goal</button>
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