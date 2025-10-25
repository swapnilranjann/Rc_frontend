import { useState, useEffect } from 'react';
import './CostCalculator.css';

interface CostCalculatorProps {
  distance: number;
  riders: number;
  defaultMileage?: number;
  defaultFuelPrice?: number;
  onChange: (costData: CostData) => void;
}

interface CostData {
  fuelCost: { perBike: number; total: number };
  tollCharges: { amount: number; numberOfTolls: number };
  parkingFees: number;
  miscellaneous: number;
  totalPerPerson: number;
  totalForGroup: number;
}

const CostCalculator = ({ distance, riders, defaultMileage, defaultFuelPrice, onChange }: CostCalculatorProps) => {
  const [fuelPrice, setFuelPrice] = useState(defaultFuelPrice || 105); // ₹/liter
  const [mileage, setMileage] = useState(defaultMileage || 35); // km/liter
  const [tollAmount, setTollAmount] = useState(0);
  const [numberOfTolls, setNumberOfTolls] = useState(0);
  const [parkingFees, setParkingFees] = useState(0);
  const [miscCharges, setMiscCharges] = useState(0);

  // Update when parent changes the defaults
  useEffect(() => {
    if (defaultMileage !== undefined) {
      setMileage(defaultMileage);
    }
  }, [defaultMileage]);

  useEffect(() => {
    if (defaultFuelPrice !== undefined) {
      setFuelPrice(defaultFuelPrice);
    }
  }, [defaultFuelPrice]);

  // Auto-calculate costs
  useEffect(() => {
    calculateCosts();
  }, [distance, riders, fuelPrice, mileage, tollAmount, numberOfTolls, parkingFees, miscCharges]);

  const calculateCosts = () => {
    // Fuel calculation
    const fuelNeeded = distance / mileage;
    const fuelCostPerBike = fuelNeeded * fuelPrice;
    const totalFuelCost = fuelCostPerBike * riders;

    // Total calculation
    const totalTollCharges = tollAmount * numberOfTolls;
    const totalCost = totalFuelCost + totalTollCharges + parkingFees + miscCharges;
    const perPersonCost = totalCost / riders;

    const costData: CostData = {
      fuelCost: {
        perBike: Math.round(fuelCostPerBike),
        total: Math.round(totalFuelCost)
      },
      tollCharges: {
        amount: totalTollCharges,
        numberOfTolls
      },
      parkingFees,
      miscellaneous: miscCharges,
      totalPerPerson: Math.round(perPersonCost),
      totalForGroup: Math.round(totalCost)
    };

    onChange(costData);
  };

  return (
    <div className="cost-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title">
          <span className="title-icon">💰</span>
          Cost Estimator
        </h3>
        <p className="calculator-subtitle">Smart cost breakdown for your ride</p>
      </div>

      <div className="calculator-body">
        {/* Fuel Section */}
        <div className="cost-section">
          <div className="section-header">
            <span className="section-icon">⛽</span>
            <h4>Fuel Costs</h4>
          </div>
          
          <div className="input-grid">
            <div className="calc-input-group">
              <label>
                <span className="label-text">Fuel Price</span>
                <span className="label-hint">(₹/liter)</span>
              </label>
              <div className="input-with-icon">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  min="80"
                  max="150"
                  step="1"
                />
              </div>
            </div>

            <div className="calc-input-group">
              <label>
                <span className="label-text">Average Mileage</span>
                <span className="label-hint">(km/liter)</span>
              </label>
              <div className="input-with-icon">
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  min="15"
                  max="100"
                  step="1"
                />
                <span className="input-suffix">km/l</span>
              </div>
            </div>
          </div>

          <div className="fuel-summary">
            <div className="summary-item">
              <span className="summary-label">Fuel Needed:</span>
              <span className="summary-value">{(distance / mileage).toFixed(2)} L</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Per Bike:</span>
              <span className="summary-value primary">₹{Math.round((distance / mileage) * fuelPrice)}</span>
            </div>
          </div>
        </div>

        {/* Toll Section */}
        <div className="cost-section">
          <div className="section-header">
            <span className="section-icon">🚧</span>
            <h4>Toll Charges</h4>
          </div>
          
          <div className="input-grid">
            <div className="calc-input-group">
              <label>
                <span className="label-text">Per Toll</span>
                <span className="label-hint">(average)</span>
              </label>
              <div className="input-with-icon">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  value={tollAmount}
                  onChange={(e) => setTollAmount(Number(e.target.value))}
                  min="0"
                  step="10"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="calc-input-group">
              <label>
                <span className="label-text">Number of Tolls</span>
              </label>
              <input
                type="number"
                value={numberOfTolls}
                onChange={(e) => setNumberOfTolls(Number(e.target.value))}
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
          </div>

          {tollAmount > 0 && numberOfTolls > 0 && (
            <div className="toll-summary">
              <span className="summary-label">Total Tolls:</span>
              <span className="summary-value">₹{tollAmount * numberOfTolls}</span>
            </div>
          )}
        </div>

        {/* Additional Costs */}
        <div className="cost-section">
          <div className="section-header">
            <span className="section-icon">💳</span>
            <h4>Additional Costs</h4>
          </div>
          
          <div className="input-grid">
            <div className="calc-input-group">
              <label>
                <span className="label-text">Parking Fees</span>
              </label>
              <div className="input-with-icon">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  value={parkingFees}
                  onChange={(e) => setParkingFees(Number(e.target.value))}
                  min="0"
                  step="10"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="calc-input-group">
              <label>
                <span className="label-text">Miscellaneous</span>
                <span className="label-hint">(food, etc.)</span>
              </label>
              <div className="input-with-icon">
                <span className="input-prefix">₹</span>
                <input
                  type="number"
                  value={miscCharges}
                  onChange={(e) => setMiscCharges(Number(e.target.value))}
                  min="0"
                  step="50"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="cost-summary-card">
          <div className="summary-row">
            <span className="summary-title">Total Estimated Cost</span>
            <span className="summary-amount">
              ₹{Math.round(
                ((distance / mileage) * fuelPrice * riders) + 
                (tollAmount * numberOfTolls) + 
                parkingFees + 
                miscCharges
              )}
            </span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="per-person-row">
            <span className="per-person-label">
              <span className="icon">👤</span>
              Per Person
            </span>
            <span className="per-person-amount">
              ₹{Math.round((
                ((distance / mileage) * fuelPrice * riders) + 
                (tollAmount * numberOfTolls) + 
                parkingFees + 
                miscCharges
              ) / riders)}
            </span>
          </div>

          <div className="summary-breakdown">
            <div className="breakdown-item">
              <span>⛽ Fuel</span>
              <span>₹{Math.round((distance / mileage) * fuelPrice * riders)}</span>
            </div>
            {tollAmount > 0 && numberOfTolls > 0 && (
              <div className="breakdown-item">
                <span>🚧 Tolls</span>
                <span>₹{tollAmount * numberOfTolls}</span>
              </div>
            )}
            {parkingFees > 0 && (
              <div className="breakdown-item">
                <span>🅿️ Parking</span>
                <span>₹{parkingFees}</span>
              </div>
            )}
            {miscCharges > 0 && (
              <div className="breakdown-item">
                <span>💳 Misc.</span>
                <span>₹{miscCharges}</span>
              </div>
            )}
          </div>
        </div>

        <div className="calculator-tips">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <strong>Pro Tip:</strong> Actual costs may vary based on riding style, traffic conditions, and fuel prices. Add 10-15% buffer for unexpected expenses.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;

