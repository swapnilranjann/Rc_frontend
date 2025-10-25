import './MotorcycleLoader.css';

interface MotorcycleLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const MotorcycleLoader = ({ size = 'medium', text }: MotorcycleLoaderProps) => {
  return (
    <div className={`motorcycle-loader-container ${size}`}>
      <div className="motorcycle-loader">
        <div className="bike">🏍️</div>
        <div className="road">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default MotorcycleLoader;

