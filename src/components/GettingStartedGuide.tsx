import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
  tips: string[];
}

const guideSteps: GuideStep[] = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Set up your profile with bike info, location, and preferences',
    icon: '👤',
    action: 'Edit Profile',
    link: '/profile',
    tips: [
      'Add your bike details and riding experience',
      'Set your location for local community suggestions',
      'Choose your favorite theme color',
      'Write a bio to connect with other riders'
    ]
  },
  {
    id: 'communities',
    title: 'Join Communities',
    description: 'Find and join communities that match your interests',
    icon: '🏘️',
    action: 'Browse Communities',
    link: '/communities',
    tips: [
      'Search by location, bike type, or riding style',
      'Join up to 5 communities to stay active',
      'Participate in community discussions',
      'Create your own community if you have an idea'
    ]
  },
  {
    id: 'events',
    title: 'Join or Create Events',
    description: 'Discover rides happening near you or organize your own',
    icon: '📅',
    action: 'Explore Events',
    link: '/events',
    tips: [
      'Filter events by date, location, and difficulty',
      'Register for rides that interest you',
      'Create your own event with route planning',
      'Use advanced features like cost estimation'
    ]
  },
  {
    id: 'rides',
    title: 'Track Your Rides',
    description: 'Keep track of your riding history and achievements',
    icon: '🗺️',
    action: 'View My Rides',
    link: '/rides',
    tips: [
      'See all your past and upcoming rides',
      'Track your riding statistics',
      'Share your ride experiences',
      'Connect with riding partners'
    ]
  },
  {
    id: 'connect',
    title: 'Connect & Share',
    description: 'Share stories, tips, and connect with fellow riders',
    icon: '🤝',
    action: 'Start Connecting',
    link: '/dashboard',
    tips: [
      'Share your success stories',
      'Write gear reviews and tips',
      'Follow other riders',
      'Engage in community discussions'
    ]
  }
];

const GettingStartedGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Always show the button for testing
  console.log('GettingStartedGuide component rendered');

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const currentGuideStep = guideSteps[currentStep];

  return (
    <>
      {/* Guide Toggle Button - Sidebar Style */}
      <button
        onClick={() => setIsOpen(true)}
        className="sidebar-guide-btn"
        title="Getting Started Guide"
      >
        <span className="guide-text">Getting Started</span>
      </button>

      {/* Guide Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="guide-overlay"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="guide-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="guide-header">
                  <div className="guide-title">
                    <h2>Getting Started with RiderConnect</h2>
                    <p>Follow these steps to make the most of your riding community</p>
                  </div>
                <button
                  className="guide-close"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="guide-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  Step {currentStep + 1} of {guideSteps.length}
                </span>
              </div>

              {/* Step Navigation */}
              <div className="guide-steps-nav">
                {guideSteps.map((step, index) => (
                  <button
                    key={step.id}
                    className={`step-nav-btn ${index === currentStep ? 'active' : ''} ${completedSteps.includes(step.id) ? 'completed' : ''}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <span className="step-nav-icon">{step.icon}</span>
                    <span className="step-nav-title">{step.title}</span>
                    {completedSteps.includes(step.id) && (
                      <span className="step-nav-check">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Current Step Content */}
              <div className="guide-content">
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-icon">{currentGuideStep.icon}</span>
                    <div className="step-info">
                      <h3>{currentGuideStep.title}</h3>
                      <p>{currentGuideStep.description}</p>
                    </div>
                  </div>

                  <div className="step-tips">
                    <h4>Pro Tips:</h4>
                    <ul>
                      {currentGuideStep.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="step-actions">
                    <Link
                      to={currentGuideStep.link}
                      className="btn btn-primary"
                      onClick={() => {
                        completeStep(currentGuideStep.id);
                        setIsOpen(false);
                      }}
                    >
                      {currentGuideStep.action}
                    </Link>
                    <button
                      className="btn btn-secondary"
                      onClick={() => completeStep(currentGuideStep.id)}
                    >
                      Mark as Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="guide-navigation">
                <button
                  className="btn btn-outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                <div className="step-indicators">
                  {guideSteps.map((_, index) => (
                    <button
                      key={index}
                      className={`step-indicator ${index === currentStep ? 'active' : ''}`}
                      onClick={() => setCurrentStep(index)}
                    />
                  ))}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={currentStep === guideSteps.length - 1}
                >
                  Next →
                </button>
              </div>

              {/* Quick Links */}
              <div className="guide-quick-links">
                <h4>Quick Access:</h4>
                <div className="quick-links-grid">
                  <Link to="/communities" className="quick-link">
                    Communities
                  </Link>
                  <Link to="/events" className="quick-link">
                    Events
                  </Link>
                  <Link to="/profile" className="quick-link">
                    Profile
                  </Link>
                  <Link to="/rides" className="quick-link">
                    My Rides
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GettingStartedGuide;
