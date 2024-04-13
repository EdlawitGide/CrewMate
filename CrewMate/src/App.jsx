import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabaseUrl = "https://pbwxksgkekdpxsvfevzj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBid3hrc2drZWtkcHhzdmZldnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5NzY0ODYsImV4cCI6MjAyODU1MjQ4Nn0.CiRx7y60q6foZiqvznJ8MyKIYtxmXyJlso4kaYzu5K8";
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="sidebar">
          <h1>Among us</h1>
          <nav>
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/add" className="nav-link">
              Add Member
            </Link>
          </nav>
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home supabase={supabase} />} />
            <Route path="/add" element={<AddMember supabase={supabase} />} />
            <Route
              path="/update/:id"
              element={<UpdateMember supabase={supabase} />}
            />
            <Route
              path="/details/:id"
              element={<MemberDetails supabase={supabase} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home = ({ supabase }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase.from("CrewMate").select("*");
      if (error) throw error;
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error.message);
    }
  };

  const deleteMember = async (id) => {
    try {
      const { error } = await supabase.from("CrewMate").delete().eq("id", id);
      if (error) throw error;
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error.message);
    }
  };

  return (
    <div className="home-container">
      <h2>Team Members</h2>
      {teamMembers.map((member) => (
        <div key={member.id} className="card">
          <Link to={`/details/${member.id}`} className="card-link">
            <div className="card-title">{member.name}</div>
            <div className="card-content">
              <p>Color: {member.color}</p>
              <p>Speed: {member.speed}</p>
            </div>
          </Link>
          <div className="card-buttons">
            <Link to={`/update/${member.id}`} className="edit-button">
              Edit
            </Link>
            <button
              className="delete-button"
              onClick={() => deleteMember(member.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddMember = ({ supabase }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [speed, setSpeed] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("CrewMate")
        .insert([{ name, color, speed }]);
      if (error) throw error;
      setName("");
      setColor("");
      setSpeed(0);
    } catch (error) {
      console.error("Error adding team member:", error.message);
    }
  };

  return (
    <div className="add-member-container">
      <h2>Add Member</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Color:</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <label>Speed:</label>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

const UpdateMember = ({ supabase }) => {
  const [member, setMember] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from("CrewMate")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      setMember(data[0]);
    } catch (error) {
      console.error("Error fetching member:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("CrewMate")
        .update({ name: member.name, color: member.color, speed: member.speed })
        .eq("id", member.id);
      if (error) throw error;
      fetchMember();
    } catch (error) {
      console.error("Error updating member:", error.message);
    }
  };

  if (!member) return null;

  return (
    <div className="update-member-container">
      <h2>Update Member</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={member.name}
          onChange={(e) => setMember({ ...member, name: e.target.value })}
        />
        <label>Color:</label>
        <input
          type="text"
          value={member.color}
          onChange={(e) => setMember({ ...member, color: e.target.value })}
        />
        <label>Speed:</label>
        <input
          type="number"
          value={member.speed}
          onChange={(e) =>
            setMember({ ...member, speed: parseInt(e.target.value) })
          }
        />
        <button type="submit">Update Member</button>
      </form>
    </div>
  );
};

const MemberDetails = ({ supabase }) => {
  const [member, setMember] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from("CrewMate")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      setMember(data[0]);
    } catch (error) {
      console.error("Error fetching member:", error.message);
    }
  };

  if (!member) return null;

  return (
    <div className="member-details-container">
      <h2>{member.name}</h2>
      <p>Color: {member.color}</p>
      <p>Speed: {member.speed}</p>
    </div>
  );
};

export default App;
