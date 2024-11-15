import FavoriteIcon from "@mui/icons-material/Favorite";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { initializeCountries } from "../store/countriesSlice";
import {
  addFavourite,
  initializeFavourites,
  removeFavourite,
} from "../store/favouritesSlice";

const Countries = () => {
  const dispatch = useDispatch();
  const countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);
  const favourites = useSelector((state) => state.favourites.favourites);
  const [search, setSearch] = useState("");

  console.log("Favourites from store", favourites);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    dispatch(initializeCountries());
    if (user) {
      dispatch(initializeFavourites());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <Container fluid>
        <Row className="justify-content-center mt-5">
          <Col className="text-center">
            <Spinner animation="border" role="status" variant="info">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4} className="my-3">
          <Form.Control
            type="search"
            placeholder="Search for countries"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {countriesList
          .filter((country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          )
          .map((country) => {
            return (
              <Col key={country.name.common}>
                <Card className="h-100">
                  <Link
                    to={`/countries/${country.name.common}`}
                    state={{ country: country }}
                  >
                    <Card.Img
                      variant="top"
                      src={country.flags.svg}
                      className="rounded h-50"
                      style={{
                        objectFit: "cover",
                        minHeight: "200px",
                        maxHeight: "200px",
                      }}
                    />
                  </Link>

                  {/* FavoriteIcon positioned below the flag */}
                  {favourites.some(
                    (favourite) => favourite === country.name?.common
                  ) ? (
                    <FavoriteIcon
                      onClick={() =>
                        dispatch(removeFavourite(country.name.common))
                      }
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginTop: "10px",
                        marginLeft: "90%", // Adjust margin as needed for placement
                      }}
                    />
                  ) : (
                    <FavoriteIcon
                      onClick={() =>
                        dispatch(addFavourite(country.name.common))
                      }
                      style={{
                        cursor: "pointer",
                        color: "black",
                        marginTop: "10px",
                        marginLeft: "90%", // Adjust margin as needed for placement
                      }}
                    />
                  )}

                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{country.name.common}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {country.name.official}
                    </Card.Subtitle>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <i className="bi bi-translate me-2"></i>
                        {Object.values(country.languages ?? {}).join(", ")}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-cash-coin me-2"></i>
                        {Object.values(country.currencies ?? {})
                          .map((currency) => currency.name)
                          .join(", ")}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-people me-2"></i>
                        {country.population.toLocaleString()}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default Countries;
