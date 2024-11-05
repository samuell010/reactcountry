import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loginWithEmailAndPassword } from "../auth/firebase";
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Card } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const login = () => {
        loginWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (loading) return;
        if (user) navigate('/countries');
    }, [user, loading, navigate]);

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
            <Card style={{ maxWidth: '400px', width: '100%', height:'450px' }} className="p-4 shadow-lg border-0">
                <h1 className="text-center mb-4 text-primary ">Login</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="border border-info"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="border border-info"
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={login}
                        className="w-100 fw-bold py-2 mt-4 border border-info"
                    >
                        Login
                    </Button>
                </Form>
                {error && <p className="text-danger text-center mt-3">{error.message}</p>}
            </Card>
        </Container>
    );
};

export default Login;
