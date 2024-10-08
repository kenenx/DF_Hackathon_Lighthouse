import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { getModels } from "../services/LLM.service.js";
import { useUser } from "../services/UserContext";

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getModels();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      // Filter items based on the search query
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.organization.toLowerCase().includes(lowerCaseQuery)
      );

      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [searchQuery, data]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  const handleSelect = (model) => {
    navigate(`/model/${model.name}`);
  };

  return (
    <Navbar className="bg-body-tertiary justify-content-between p-3 red">
      <Navbar.Brand className="white" href="/">Lighthouse</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form onSubmit={(e) => e.preventDefault()} className="d-flex me-auto">
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="me-2"
          />
          {filteredData.length > 0 && (
            <Dropdown className="search-dropdown">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Search Results
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {filteredData.map((item) => (
                  <Dropdown.Item
                    key={item.id}
                    onClick={() => handleSelect(item)}
                  >
                    {item.name} - {item.organization}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Form>
        <Nav className="ms-auto">
          <Nav.Link href="/matrix" className="white">
            Matrix
          </Nav.Link>
          <Nav.Link href="/catalog" className="white">
            Catalog
          </Nav.Link>
          {user ? (
            <>
              <Nav.Link href="/feedback" className="white">
                Feedback
              </Nav.Link>
              <Nav.Link onClick={handleLogout} href="/" className="white">
                Logout
              </Nav.Link>
            </>
          ) : (
            <Nav.Link href="/login" className="white">
              Login
            </Nav.Link>
          )}
        </Nav>
        {user?.role === "admin" && (
          <Nav className="admin-tools ms-3">
            <Nav.Link href="/addLLM" className="white">
              Add LLM
            </Nav.Link>
            <Nav.Link href="/viewFeedback" className="white">
              View Feedback
            </Nav.Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
