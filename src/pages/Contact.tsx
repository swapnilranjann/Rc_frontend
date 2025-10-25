import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contactAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const Contact = () => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'General'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      showToast('Name is required! 👤', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Email is required! 📧', 'error');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address! 📧', 'error');
      return;
    }
    if (!formData.subject.trim()) {
      showToast('Subject is required! 📝', 'error');
      return;
    }
    if (!formData.message.trim()) {
      showToast('Message is required! 💬', 'error');
      return;
    }
    if (formData.message.trim().length < 10) {
      showToast('Message must be at least 10 characters! 💬', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await contactAPI.send(formData);
      showToast('Message sent successfully! We\'ll get back to you soon! 🎉');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'General'
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="contact-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          <div className="contact-header">
            <h1>📧 Get In Touch</h1>
            <p>Have questions? We'd love to hear from you!</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="info-item">
                <span className="icon">📍</span>
                <div>
                  <h3>Address</h3>
                  <p>New Delhi, India</p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>support@riderconnect.com</p>
                </div>
              </div>
              <div className="info-item">
                <span className="icon">📞</span>
                <div>
                  <h3>Phone</h3>
                  <p>+91 9876543210</p>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="General">General Inquiry</option>
                  <option value="Support">Support</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us more..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? '📤 Sending...' : '📧 Send Message'}
              </button>
            </form>
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </PageTransition>
  );
};

export default Contact;

