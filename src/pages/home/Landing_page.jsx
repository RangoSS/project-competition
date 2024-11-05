import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import { FacebookShareButton, WhatsappShareButton, FacebookIcon, WhatsappIcon } from 'react-share';
import Rating from 'react-rating-stars-component';
import './landing_page.scss';
import Navbar from "../../components/navbar/Navbar";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle product selection
  const handleBook = (product) => {
    setSelectedProduct(product);
    setShowBookingModal(true);
  };

  // Function to close the booking modal
  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    // Resetting form fields
    setQuantity(1);
    setName('');
    setPhone('');
    setTotalPrice(0);
  };

  // Function to close the product details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  // Function to handle booking submission
  const handleBookingSubmit = async () => {
    const currentUserId = localStorage.getItem("user");
    if (!currentUserId) {
      alert("You need to log in to purchase a product.");
      navigate("/login");
      return;
    }

    const bookingData = {
      userId: currentUserId,
      productId: selectedProduct.id,
      quantity,
      totalPrice,
      name,
      phone,
    };

    // Calculate total price based on product price and quantity
    const pricePerUnit = selectedProduct.price || 0; // Assuming the product has a price field
    setTotalPrice(pricePerUnit * quantity);

    // Save to your desired endpoint (replace with your booking logic)
    // await setDoc(doc(db, "bookings", `${currentUserId}_${selectedProduct.id}`), bookingData);
    alert("Successfully booked! You can add more.");
    handleCloseBookingModal(); // Close modal
  };

  return (
    <div className="landing-page">
      <Navbar />
      <h1>Product Listings</h1>
      <div className="product-cards-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.photo} alt="Product" className="product-image" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div className="product-details">
              <h2>{product.name}</h2>
              <p><strong>Location:</strong> {product.storeLocation}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <div className="button-container">
                <Button className="button primary" onClick={() => { setSelectedProduct(product); setShowDetailsModal(true); }}>
                  View Details
                </Button>
                <Button className="button primary" onClick={() => handleBook(product)}>
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={handleCloseBookingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Purchase {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>
            <h5>Total Price: ${totalPrice}</h5>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBookingModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBookingSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for showing selected product details */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Details</h5>
          <p><strong>Location:</strong> {selectedProduct?.storeLocation}</p>
          <p><strong>Category:</strong> {selectedProduct?.category}</p>
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <p><strong>Contact:</strong> {selectedProduct?.contact}</p>

          <h5>Gallery</h5>
          <img src={selectedProduct?.photo} alt="Product" style={{ width: '100%', height: '150px', objectFit: 'cover', margin: '5px' }} />

          <div className="share-buttons">
            <FacebookShareButton url={`http://your-website.com/products/${selectedProduct?.id}`} quote={selectedProduct?.name}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton url={`http://your-website.com/products/${selectedProduct?.id}`} title={selectedProduct?.name}>
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </div>

          <Rating
            count={5}
            onChange={(rating) => setUserRating(rating)}
            size={24}
            activeColor="#ffd700"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleBook(selectedProduct)}>
            Buy Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LandingPage;
