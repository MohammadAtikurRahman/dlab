// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import schoolIconUrl from "./school.png"; // Adjust the path as necessary

// // Custom icon for school
// const schoolIcon = new L.Icon({
//   iconUrl: schoolIconUrl,
//   iconSize: [50, 50], // Adjust size as needed
//   iconAnchor: [25, 50], // Adjust anchor as needed
//   popupAnchor: [0, -50],
// });

// // Array of school positions and names
// const schools = [
//   {
//     position: [22.44257339143146, 91.82923420610742],
//     schoolname: "Fateyabad Mohakali Balika Uccho Biddaloy",
//   },
//   {
//     position: [23.8103, 90.4125],
//     schoolname: "Ruhul Amin Khan Uccho Biddaloy",
//   },
//   { position: [24.8949, 91.8687], schoolname: "Shyamganj Uccho Biddaloy" },
// ];

// const MapComponent = () => {
//   const [lat] = useState(23.685);
//   const [lng] = useState(90.3563);
//   const [zoom] = useState(7);

//   const position = [lat, lng];

//   return (
//     <MapContainer center={position} zoom={zoom} style={{ height: "70em" }}>
//       <TileLayer
//         attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {schools.map((school, index) => (
//         <Marker key={index} position={school.position} icon={schoolIcon}>
//           <Popup>
//             <div className="text-center p-4">

//               <h4 className="mb-2"><strong> SCHOOL </strong></h4>
//               <hr></hr>
//               <button className="btn btn-primary w-100 mb-2">{school.schoolname}</button>

//               <button className="btn btn-danger w-100 mb-2">Active Pc: 1</button>
//               <button className="btn btn-success w-100 mb-2">Active Lab: 1</button>


//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapComponent;
// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import schoolIconUrl from "./school.png"; // Adjust the path as necessary

// // Custom icon for school
// const schoolIcon = new L.Icon({
//   iconUrl: schoolIconUrl,
//   iconSize: [50, 50], // Adjust size as needed
//   iconAnchor: [25, 50], // Adjust anchor as needed
//   popupAnchor: [0, -50],
// });

// // Array of school positions and names
// const schools = [
//   {
//     position: [22.44257339143146, 91.82923420610742],
//     schoolname: "Fateyabad Mohakali Balika Uccho Biddaloy",
//   },
//   {
//     position: [23.8103, 90.4125],
//     schoolname: "Ruhul Amin Khan Uccho Biddaloy",
//   },
//   {
//     position: [24.8949, 91.8687],
//     schoolname: "Shyamganj Uccho Biddaloy",
//   },
// ];

// const MapComponent = () => {
//   const [lat] = useState(23.685);
//   const [lng] = useState(90.3563);
//   const [zoom] = useState(7);

//   const position = [lat, lng];

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-4 p-4" style={{ background: "#ECF0F1"}}>
//           <button className="text-center btn btn-danger w-100">School Information</button>
//           <hr></hr>
//           <div className="list-group">
//             {schools.map((school, index) => (
//               // eslint-disable-next-line jsx-a11y/anchor-is-valid
//               <a
//                 key={index}
//                 href="#"
//                 className="list-group-item list-group-item-action"
//               >
//                 <h5 className="mb-1">{school.schoolname}</h5>
//                 <small>Coordinates: {school.position.join(", ")}</small>
//                 <button className="btn btn-primary w-100 mt-2">Subscribe</button>
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Map */}
//         <div className="col-md-8 p-0">
//           <MapContainer center={position} zoom={zoom} style={{ height: "100vh" }}>
//             <TileLayer
//               attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             {schools.map((school, index) => (
//               <Marker key={index} position={school.position} icon={schoolIcon}>
//                 <Popup>
//                   <div className="text-center p-4">
//                     <h4 className="mb-2"><strong>SCHOOL</strong></h4>
//                     <hr />
//                     <button className="btn btn-primary w-100 mb-2" style={{ fontSize: "16px" }}>{school.schoolname}</button>
//                     <button className="btn btn-danger w-100 mb-2" style={{ fontSize: "16px" }}>Active Pc: 1</button>
//                     <button className="btn btn-success w-100 mb-2" style={{ fontSize: "16px" }}>Active Lab: 1</button>
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapComponent;



import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import schoolIconUrl from "./school.png"; // Adjust the path as necessary

// Custom icon for school
const schoolIcon = new L.Icon({
  iconUrl: schoolIconUrl,
  iconSize: [50, 50], // Adjust size as needed
  iconAnchor: [25, 50], // Adjust anchor as needed
  popupAnchor: [0, -50],
});

// Array of school positions and names
const schools = [
  {
    position: [22.44257339143146, 91.82923420610742],
    schoolname: "Fateyabad Mohakali Balika Uccho Biddaloy",
  },
  {
    position: [23.8103, 90.4125],
    schoolname: "Ruhul Amin Khan Uccho Biddaloy",
  },
  {
    position: [24.8949, 91.8687],
    schoolname: "Shyamganj Uccho Biddaloy",
  },
];

const FocusHandler = ({ mapRef }) => {
  useMapEvent('popupopen', () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return null;
};

const MapComponent = () => {
  const [lat] = useState(23.685);
  const [lng] = useState(90.3563);
  const [zoom] = useState(7);

  const position = [lat, lng];
  const mapRef = useRef();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4 p-4" style={{ background: "#ECF0F1"}}>
          <button className="text-center btn btn-danger w-100">School Information</button>
          <hr></hr>
          <div className="list-group">
            {schools.map((school, index) => (
              <div key={index} className="list-group-item list-group-item-action">
                <h6 className="mb-1"><i className="fa fa-school mx-1"></i>  {school.schoolname}</h6>
                {/* <small>Coordinates: {school.position.join(", ")}</small> */}
             
                <small> <i className="fa fa-desktop mx-2"></i>    Active Lab: 23</small>
                <br>
                 </br>
                <small> <i className="fa fa-desktop mx-2"></i> Active PC: 34 </small>
                <button className="btn btn-primary w-100 mt-2">Distance From You</button>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="col-md-8 p-0">

        <div className="d-flex justify-content-between align-items-center p-3 bg-light">
            <h4 className="m-0">Find the School</h4>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Enter location here"
            />
            <button className="btn btn-primary">
              <i className="fa fa-search"></i>
            </button>
          </div>
            






          <div ref={mapRef}>
            <MapContainer center={position} zoom={zoom} style={{ height: "650px" }}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FocusHandler mapRef={mapRef} />
              {schools.map((school, index) => (
                <Marker key={index} position={school.position} icon={schoolIcon}>
                  <Popup>
                    <div className="text-center p-4">
                      <h4 className="mb-2"><strong>SCHOOL</strong></h4>
                      <hr />
                      <button className="btn btn-primary w-100 mb-2" style={{ fontSize: "16px" }}>{school.schoolname}</button>
                      <button className="btn btn-danger w-100 mb-2" style={{ fontSize: "16px" }}>Active Pc: 1</button>
                      <button className="btn btn-success w-100 mb-2" style={{ fontSize: "16px" }}>Active Lab: 1</button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          
          {/* <div className="d-flex  align-items-center p-3 bg-light">
            
            <button className="btn btn-primary">
              <i className="fa fa-bell mx-2"></i> 
              Trail Version Activated
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
