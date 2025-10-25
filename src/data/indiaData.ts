// Indian States and Cities Data
export interface StateCity {
  state: string;
  cities: string[];
}

export const indianStatesAndCities: StateCity[] = [
  {
    state: 'Delhi',
    cities: ['New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Central Delhi']
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane', 'Kolhapur']
  },
  {
    state: 'Karnataka',
    cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Dharwad']
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore']
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar']
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur']
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Noida', 'Ghaziabad']
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Darjeeling']
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar']
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati']
  },
  {
    state: 'Kerala',
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad']
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Ratlam']
  },
  {
    state: 'Punjab',
    cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali']
  },
  {
    state: 'Haryana',
    cities: ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak']
  },
  {
    state: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Bihar Sharif']
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri']
  },
  {
    state: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh']
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tezpur']
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Mussoorie', 'Rishikesh']
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Solan', 'Mandi']
  },
  {
    state: 'Jammu and Kashmir',
    cities: ['Srinagar', 'Jammu', 'Leh', 'Anantnag', 'Baramulla', 'Udhampur']
  },
  {
    state: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Raigarh']
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda']
  },
  {
    state: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  }
];

// Comprehensive Bike Manufacturers List
export interface BikeType {
  value: string;
  label: string;
  icon: string;
  country?: string;
}

export const bikeManufacturers: BikeType[] = [
  // Indian Brands
  { value: 'Royal Enfield', label: 'Royal Enfield', icon: '🏍️', country: 'India' },
  { value: 'Bajaj', label: 'Bajaj', icon: '🏍️', country: 'India' },
  { value: 'TVS', label: 'TVS', icon: '🏍️', country: 'India' },
  { value: 'Hero', label: 'Hero', icon: '🏍️', country: 'India' },
  
  // Japanese Brands
  { value: 'Honda', label: 'Honda', icon: '🏍️', country: 'Japan' },
  { value: 'Yamaha', label: 'Yamaha', icon: '🏍️', country: 'Japan' },
  { value: 'Suzuki', label: 'Suzuki', icon: '🏍️', country: 'Japan' },
  { value: 'Kawasaki', label: 'Kawasaki', icon: '🏍️', country: 'Japan' },
  
  // European Brands
  { value: 'KTM', label: 'KTM', icon: '🏍️', country: 'Austria' },
  { value: 'BMW', label: 'BMW', icon: '🏍️', country: 'Germany' },
  { value: 'Ducati', label: 'Ducati', icon: '🏍️', country: 'Italy' },
  { value: 'Triumph', label: 'Triumph', icon: '🏍️', country: 'UK' },
  { value: 'Aprilia', label: 'Aprilia', icon: '🏍️', country: 'Italy' },
  { value: 'Benelli', label: 'Benelli', icon: '🏍️', country: 'Italy' },
  { value: 'MV Agusta', label: 'MV Agusta', icon: '🏍️', country: 'Italy' },
  { value: 'Husqvarna', label: 'Husqvarna', icon: '🏍️', country: 'Sweden' },
  
  // American Brands
  { value: 'Harley Davidson', label: 'Harley Davidson', icon: '🏍️', country: 'USA' },
  { value: 'Indian Motorcycle', label: 'Indian Motorcycle', icon: '🏍️', country: 'USA' },
  
  // Chinese/Other Brands
  { value: 'Jawa', label: 'Jawa', icon: '🏍️', country: 'Czech/India' },
  { value: 'Yezdi', label: 'Yezdi', icon: '🏍️', country: 'India' },
  { value: 'CFMoto', label: 'CFMoto', icon: '🏍️', country: 'China' },
  
  // All Types Option
  { value: 'All Types', label: 'All Types', icon: '🌟', country: 'All' },
  { value: 'Other', label: 'Other', icon: '🔧', country: 'Other' },
];

// Helper function to get cities by state
export const getCitiesByState = (state: string): string[] => {
  const stateData = indianStatesAndCities.find(s => s.state === state);
  return stateData ? stateData.cities : [];
};

// Helper function to get all states
export const getAllStates = (): string[] => {
  return indianStatesAndCities.map(s => s.state);
};

// Popular cities for quick access
export const popularCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Chennai',
  'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh',
  'Kochi', 'Goa', 'Lucknow', 'Amritsar', 'Srinagar'
];

