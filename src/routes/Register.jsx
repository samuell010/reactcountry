import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from "../auth/firebase";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Card } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const register = () => {
        if (!name) {
            alert('Please enter your name');
            return;
        }
        registerWithEmailAndPassword(name, email, password);
    };

    useEffect(() => {
        if (loading) return;
        if (user) navigate('/countries');
    }, [user, loading, navigate]);

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
            <Card style={{ maxWidth: '400px', width: '100%' }} className="p-4 shadow-lg border-0">
                <h2 className="text-center mb-4 text-primary">Register</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="p-2"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="p-2"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="p-2"
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={register}
                        className="w-100 mt-3 fw-bold"
                    >
                        Register
                    </Button>
                </Form>
                {error && <p className="text-danger text-center mt-3">{error.message}</p>}
            </Card>
        </Container>
    );
};

export default Register;
