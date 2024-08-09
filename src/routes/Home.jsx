import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container className="mt-5">
      {/* Welcome and Introduction */}
      <Row className="text-center">
        <Col>
          <h1>Welcome to Country Explorer</h1>
          <p>Discover, learn, and favorite countries around the world. Join us to start your journey!</p>
        </Col>
      </Row>

      {/* Get Started Section */}
      <Row className="mt-5">
        <Col className="text-center">
          <h2>Get Started</h2>
          <p>Create an account or log in to start favoriting your preferred countries.</p>
          <Link to="/register">
            <Button variant="success" size="lg" className="mx-2">
              Register
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline-primary" size="lg" className="mx-2">
              Login
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Why Choose Us Section */}
      <Row className="mt-5">
        <Col className="text-center">
          <h2>Why Choose Us?</h2>
          <p>
            We offer a comprehensive guide to every country, including detailed information on culture, economy, and geography.
          </p>
        </Col>
      </Row>

      {/* Feature Cards */}
      <Row xs={1} md={2} lg={3} className="g-4 mt-3 text-center">
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Global Search</Card.Title>
              <Card.Text>
                Search for any country across the globe and learn more about it.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Favorite Countries</Card.Title>
              <Card.Text>
                Save your favorite countries and view them anytime in your personalized list.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>lorem </Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius similique eaque excepturi debitis sed unde odio exercitationem soluta nulla aperiam molestiae accusantium, voluptas tempore distinctio provident iure amet repudiandae sapiente! .
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
