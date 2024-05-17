// import React, { useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const MapComponent = () => {
//   const [lat] = useState(23.6850);
//   const [lng] = useState(90.3563);
//   const [zoom] = useState(7);

//   const position = [lat, lng];

//   return (
//     <MapContainer center={position} zoom={zoom} style={{ height: "70em" }}>
//       <TileLayer
//         attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//     </MapContainer>
//   );
// };

// export default MapComponent;

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import schoolIconUrl from "./school.png"; // Adjust the path as necessary

// Custom icon for school
const schoolIcon = new L.Icon({
  iconUrl: schoolIconUrl,
  iconSize: [50, 50], // Adjust size as needed
  iconAnchor: [25, 50], // Adjust anchor as needed
  popupAnchor: [0, -50]
});

// Array of school positions and names
const schools = [
  { position: [22.44257339143146, 91.82923420610742], schoolname: "Fateyabad Mohakali Balika Uccho Biddaloy" },
  { position: [23.8103, 90.4125], schoolname: "Ruhul Amin Khan Uccho Biddaloy" },
  { position: [24.8949, 91.8687], schoolname: "Shyamganj Uccho Biddaloy" }
];

const MapComponent = () => {
  const [lat] = useState(23.6850);
  const [lng] = useState(90.3563);
  const [zoom] = useState(7);

  const position = [lat, lng];

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "70em" }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {schools.map((school, index) => (
        <Marker key={index} position={school.position} icon={schoolIcon}>
          <Popup>
            {school.schoolname}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
