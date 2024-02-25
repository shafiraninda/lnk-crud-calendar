import React, {useState} from "react";
import "./Login.css";
import { Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { API_URL } from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import { update } from '../../features/userSlice';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const Login = async (e) => {
        e.preventDefault();
        try {
            const auth = await Axios.post(`${API_URL}/login`, {
                username: username,
                password: password
            })
            
            dispatch(update(auth.data.data))
            localStorage.setItem("authKey", JSON.stringify(auth.data.data))
            navigate('/')
        } catch (error) {
            if(error.response){
                console.log(error.response.data)
            }
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center" id="container">
            <Card className="w-50 m-5 p-3">
                <Card.Title className="fw-bold fs-2 mt-2">Login</Card.Title>
                <Card.Body>
                    <Form onSubmit={Login} className="p-3">
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
                    <div>
                        <p>
                            Do not have an account? <Link to="/signup">Signup</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login;