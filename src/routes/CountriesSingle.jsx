import React from "react";
import { Container, Card, ListGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const CountriesSingle = () => {
  const location = useLocation();
  const country = location.state?.country; // Get the country data passed from the previous page

  if (!country) {
    return (
      <Container>
        <div>No country data available.</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="mx-auto" style={{ maxWidth: "600px" }}>
        <Card.Img
          variant="top"
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title>{country.name.common}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {country.name.official}
          </Card.Subtitle>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Capital:</strong> {country.capital?.[0] ?? "N/A"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Region:</strong> {country.region}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Subregion:</strong> {country.subregion}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Population:</strong> {country.population.toLocaleString()}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Languages:</strong>{" "}
              {Object.values(country.languages ?? {}).join(", ")}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Currencies:</strong>{" "}
              {Object.values(country.currencies ?? {})
                .map((currency) => currency.name)
                .join(", ")}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Area:</strong> {country.area.toLocaleString()} km²
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Timezones:</strong> {country.timezones.join(", ")}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CountriesSingle;
