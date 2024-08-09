import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeCountries } from "../store/countriesSlice";
import { initializeFavourites, addFavouriteThunk } from "../store/favouritesSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database"; 

const Countries = () => {
  const dispatch = useDispatch();
  const countriesList = useSelector((state) => state.countries.countries || []);
  const loading = useSelector((state) => state.countries.isLoading);
  const favourites = useSelector((state) => state.favourites.favourites || []);
  const [search, setSearch] = useState("");
  const [localFavourites, setLocalFavourites] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    dispatch(initializeCountries());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(initializeFavourites());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const favRef = ref(db, `favourites/${user.uid}`);
      get(favRef).then((snapshot) => {
        if (snapshot.exists()) {
          const favs = snapshot.val();
          setLocalFavourites(favs || {});
        }
      });
    }
  }, [user]);

  const handleAddFavourite = (country) => {
    if (!user) {
      alert("Please sign in to add favourites");
      return;
    }
    const updatedFavourites = {
      ...localFavourites,
      [country.name.common]: !localFavourites[country.name.common],
    };
    setLocalFavourites(updatedFavourites);

    const db = getDatabase();
    const favRef = ref(db, `favourites/${user.uid}`);
    set(favRef, updatedFavourites);

    dispatch(addFavouriteThunk(country));
  };

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
            const isFavourite = !!localFavourites[country.name.common];

            return (
              <Col key={country.name.common}>
                <Card className="h-100">
                  <FavoriteIcon
                    onClick={() => handleAddFavourite(country)}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      zIndex: "1",
                      color: isFavourite ? "red" : "black",
                    }}
                  />
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
