import React, {useState} from "react";
import "./Signup.css";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../config/api";

function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const Signup = async (e) => {
        e.preventDefault();
        try {
            await Axios.post(`${API_URL}/user/create`, {
                username: username,
                password: password
            })

            navigate('/login')
        } catch (error) {
            if(error.response){
                console.log(error.response.data)
            }
        }
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center" id="container">
            <Card className="w-50 m-5 p-3">
                <Card.Title className="fw-bold fs-2 mt-2">Signup</Card.Title>
                <Card.Body>
                    <Form onSubmit={Signup} className="p-3">
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Signup;