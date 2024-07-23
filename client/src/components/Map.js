import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, StandaloneSearchBox } from '@react-google-maps/api';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/locationService';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const libraries = ['places'];

function Map() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', visitDate: '' });
  const searchBoxRef = useRef(null);

  useEffect(() => {
    async function fetchLocations() {
      const data = await getLocations();
      setLocations(data);
    }
    fetchLocations();
  }, []);

  const handleMapClick = (e) => {
    const location = {
      coordinates: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    };
    setNewLocation(location);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (newLocation) {
      const location = {
        ...newLocation,
        ...formData,
        visitDate: new Date(formData.visitDate)
      };
      const savedLocation = await createLocation(location);
      console.log('Saved location:', savedLocation);
      setLocations([...locations, savedLocation]);
      setNewLocation(null);
      setShowForm(false);
      setFormData({ name: '', visitDate: '' });
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    if (selectedLocation) {
      const updatedLocation = {
        ...selectedLocation,
        ...formData,
        visitDate: new Date(formData.visitDate)
      };
      const updated = await updateLocation(selectedLocation._id, updatedLocation);
      console.log('Updated location:', updated);
      setLocations(locations.map(loc => (loc._id === updated._id ? updated : loc)));
      setSelectedLocation(null);
      setShowForm(false);
      setFormData({ name: '', visitDate: '' });
    }
  };

  const handleDeleteLocation = async (id) => {
    console.log('Deleting location with id:', id);
    await deleteLocation(id);
    setLocations(locations.filter(location => location._id !== id));
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setFormData({ name: location.name, visitDate: new Date(location.visitDate).toISOString().slice(0, 16) });
    setShowForm(true);
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const location = {
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      name: place.name
    };

    setNewLocation(location);
    setShowForm(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <LoadScript googleMapsApiKey="AIzaSyADQ8c0biSds8uJdkxyai32i5GHI79mh-A" libraries={libraries}>
        <StandaloneSearchBox
          onLoad={ref => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for places..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: '10'
            }}
          />
        </StandaloneSearchBox>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {locations.map(location => (
            <Marker
              key={location._id}
              position={location.coordinates}
              onClick={() => handleMarkerClick(location)}
              onRightClick={() => handleDeleteLocation(location._id)}
            />
          ))}
          {newLocation && (
            <Marker
              position={newLocation.coordinates}
            />
          )}
          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.coordinates}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3>{selectedLocation.name}</h3>
                <p>{new Date(selectedLocation.visitDate).toLocaleString()}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      {showForm && (
        <form onSubmit={selectedLocation ? handleUpdateLocation : handleSaveLocation}>
          <input
            type="text"
            name="name"
            placeholder="Enter location name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="datetime-local"
            name="visitDate"
            placeholder="Enter visit date"
            value={formData.visitDate}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{selectedLocation ? 'Update Location' : 'Save Location'}</button>
        </form>
      )}
    </div>
  );
}

export default Map;