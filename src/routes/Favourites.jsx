import axios from "axios";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { initializeCountries } from "../store/countriesSlice";
import {
  clearFavourites,
  initializeFavourites,
  removeFavourite,
} from "../store/favouritesSlice"; // Import the removeFavourite action

const Favourites = () => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.favourites);
  const countriesLoading = useSelector((state) => state.countries.loading);
  const favouritesLoading = useSelector((state) => state.favourites.loading);
  const [countriesData, setCountriesData] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // Load both countries and favourites on component mount
    const loadData = async () => {
      await dispatch(initializeCountries());
      await dispatch(initializeFavourites());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountriesData(response.data);
    };
    fetchCountriesData();
  }, []);

  const getCountryData = (countryName) => {
    return countriesData.find((country) => country.name.common === countryName);
  };

  if (countriesLoading || favouritesLoading) {
    return (
      <Col className="text-center m-5">
        <Spinner
          animation="border"
          role="status"
          className="center"
          variant="info"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  }

  return (
    <Container fluid>
      <Row xs={2} md={3} lg={4} className="g-3">
        {favourites.map((countryName) => {
          const country = getCountryData(countryName);
          if (!country) return null;

          return (
            <Col key={country.name.official} className="mt-5">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  className="rounded h-50"
                  src={country.flags.svg}
                  style={{
                    objectFit: "cover",
                    minHeight: "200px",
                    maxHeight: "200px",
                  }}
                />
                
                {/* Favorite icon below the flag */}
                <FavoriteIcon
                  onClick={() => dispatch(removeFavourite(country.name.common))}
                  style={{
                    cursor: "pointer",
                    color: favourites.includes(country.name.common)
                      ? "red"
                      : "black",
                    marginTop: "10px",
                    marginLeft: "90%", // Adjust to align right below the flag
                  }}
                />

                <Card.Body className="d-flex flex-column">
                  <Card.Title>{country.name.common}</Card.Title>
                  <Card.Subtitle className="mb-5 text-muted">
                    {country.name.official}
                  </Card.Subtitle>
                  <ListGroup
                    variant="flush"
                    className="flex-grow-1 justify-content-end"
                  >
                    <ListGroup.Item>
                      <i className="bi bi-translate me-2"></i>
                      {Object.values(country.languages ?? {}).join(", ")}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <i className="bi bi-cash-coin me-2"></i>
                      {Object.values(country.currencies || {})
                        .map((currency) => currency.name)
                        .join(", ")}
                    </ListGroup.Item>
                    <ListGroup.Item>
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

export default Favourites;
