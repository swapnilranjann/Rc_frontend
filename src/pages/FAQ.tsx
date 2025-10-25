import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const faqData = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is RiderConnect?',
        a: 'RiderConnect is India\'s fastest-growing motorcycle community platform where riders can connect, plan rides, share experiences, and discover new routes across the country.'
      },
      {
        q: 'Is RiderConnect free to use?',
        a: 'Yes! RiderConnect is completely free for all riders. Create an account, join communities, and start riding!'
      },
      {
        q: 'How do I join a community?',
        a: 'Browse communities on the Communities page, find one that interests you, and click "Join Community". You\'ll instantly become a member!'
      }
    ]
  },
  {
    category: 'Rides & Events',
    questions: [
      {
        q: 'How do I organize a ride?',
        a: 'Go to the Events page, click "Create Event", fill in the details about your ride (location, date, difficulty), and publish it. Other riders can then join your ride!'
      },
      {
        q: 'Can I cancel my event registration?',
        a: 'Yes, you can unregister from an event anytime before it starts. Go to My Rides and click "Unregister" on the event you want to leave.'
      },
      {
        q: 'What if it rains on the ride day?',
        a: 'Event organizers will communicate any changes or cancellations. Always check the event page for updates before heading out.'
      }
    ]
  },
  {
    category: 'Safety',
    questions: [
      {
        q: 'Do I need special gear for group rides?',
        a: 'Yes! Always wear a helmet (mandatory), riding jacket, gloves, and proper riding boots. Check our Safety Guide for detailed recommendations.'
      },
      {
        q: 'Are rides suitable for beginners?',
        a: 'Absolutely! We have rides marked as "Easy" difficulty perfect for beginners. Start with shorter, highway rides to build confidence.'
      },
      {
        q: 'What should I do in case of emergency?',
        a: 'Always ride with a first-aid kit and emergency contacts. Group rides should have a sweep rider. Call local emergency services (112) if needed.'
      }
    ]
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        q: 'How do I update my profile?',
        a: 'Click on your profile icon, go to "My Profile", and click "Edit Profile". You can update your name, city, bike details, and bio.'
      },
      {
        q: 'Can I follow other riders?',
        a: 'Yes! Visit any rider\'s profile and click "Follow". You\'ll see their activity and can connect easily for rides.'
      },
      {
        q: 'How do I change my bike information?',
        a: 'Go to My Profile, click "Edit Profile", and update your bike type and model. We support 80+ manufacturers!'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Which browsers are supported?',
        a: 'RiderConnect works best on Chrome, Firefox, Safari, and Edge (latest versions). Mobile browsers are fully supported too!'
      },
      {
        q: 'Is there a mobile app?',
        a: 'We\'re currently focused on our web platform. However, our website is fully responsive and works great on mobile browsers!'
      },
      {
        q: 'I found a bug. How do I report it?',
        a: 'Please use our Contact form and select "Bug Report" as the type. Describe the issue in detail and we\'ll fix it ASAP!'
      }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="faq-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          <div className="faq-header">
            <h1>❓ Frequently Asked Questions</h1>
            <p>Find answers to common questions about RiderConnect</p>
          </div>

          <div className="faq-content">
            {faqData.map((category, catIndex) => (
              <div key={catIndex} className="faq-category">
                <h2>{category.category}</h2>
                <div className="faq-list">
                  {category.questions.map((item, qIndex) => {
                    const id = `${catIndex}-${qIndex}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button 
                          className="faq-question"
                          onClick={() => toggleFAQ(id)}
                        >
                          <span>{item.q}</span>
                          <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="faq-footer">
            <h3>Still have questions?</h3>
            <p>Can't find what you're looking for? Reach out to our team!</p>
            <a href="/contact" className="btn btn-primary">📧 Contact Us</a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FAQ;

