import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";

import { createFeedback } from "../services/feedback.service.js";
import { useUser } from "../services/UserContext";

const LeaveFeedback = () => {
  const { user } = useUser()
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const userId = user.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedback = {
      rating,
      description,
      userId,
    };
    console.log(feedback);
    try {
      await createFeedback(feedback);
      alert("Feedback submitted successfully!");
      setRating(0);
      setDescription("");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rating ? "text-warning" : "text-muted"}
        style={{ cursor: "pointer", fontSize: "1.5em" }}
        onClick={() => setRating(star)}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container className="mt-5 pt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Header as="h3" style={{ backgroundColor: "#CD6675" }}>
                Leave Feedback
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formRating" className="mb-3">
                    <Row>
                      <Col md={4} className="d-flex align-items-center">
                        <Form.Label className="fw-bold mb-0">Rating</Form.Label>
                      </Col>
                      <Col md={8}>
                        <div>{renderStars()}</div>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group controlId="formDescription" className="mb-3">
                    <Row>
                      <Col md={4} className="d-flex align-items-center">
                        <Form.Label className="fw-bold mb-0">
                          Description
                        </Form.Label>
                      </Col>
                      <Col md={8}>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="mt-3 custom-button"
                  >
                    Submit Feedback
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeaveFeedback;
