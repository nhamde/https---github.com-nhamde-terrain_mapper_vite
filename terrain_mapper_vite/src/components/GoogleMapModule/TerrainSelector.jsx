import {useRef} from "react";
import {useSelector, useDispatch} from 'react-redux';
import { GoogleMap, LoadScript, Rectangle } from "@react-google-maps/api";
import { calculatePlaneSize } from "../functionalities";
import { setAreaSelection } from "../../store/slices/AreaSelectionSlice";
import { setPlaneSize } from "../../store/slices/PlaneSizeSlice";
import { VITE_GOOGLE_MAPS_API_KEY } from "../../apiKey2";
import PropTypes from "prop-types";

const libraries = ["drawing"]; // Load drawing tools

// TerrainSelector component
const TerrainSelector = ({ onAreaSelect}) => 
{
    const mapRef = useRef(null);
    const selection = useSelector((state)=> state.areaSelector);
    const dispatch = useDispatch();

    const handleLoad = (map) => 
    {
      mapRef.current = map;
      const drawingManager = new window.google.maps.drawing.DrawingManager(
      {
        drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: 
        {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ["rectangle", "polygon"],
        },
      });

      drawingManager.setMap(map);

      window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => 
      {
          let bounds;
          if (event.type === "rectangle")
          {
              bounds = event.overlay.getBounds();
          }
          else if (event.type === "polygon")
          {
              bounds = new window.google.maps.LatLngBounds();
              const path = event.overlay.getPath(); // Get polygon vertices

              path.forEach((latLng) => bounds.extend(latLng));
          }   
          event.overlay.setMap(null); // Remove rectangle after selection
          console.log("shapeType: ", event.type)
          const selectedArea = 
          {
              north: bounds.getNorthEast().lat(),
              south: bounds.getSouthWest().lat(),
              east: bounds.getNorthEast().lng(),
              west: bounds.getSouthWest().lng()
          };
          console.log("SelectedArea: ",selectedArea)

          const {width, height} = calculatePlaneSize(selectedArea.north, selectedArea.south, selectedArea.east, selectedArea.west);
          dispatch(setPlaneSize({width, height}));
          dispatch(setAreaSelection(selectedArea));
          onAreaSelect(selectedArea);
      });
    };

  return (
    <LoadScript googleMapsApiKey={VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={{ width: "50vw", height: "50vh" }}
        center={{ lat: 19.38111111, lng: 77.35555556 }}
        zoom={20}
        onLoad={handleLoad}
      >
        {selection && (
          <Rectangle
            bounds={{
              north: selection.north,
              south: selection.south,
              east: selection.east,
              west: selection.west,
            }}
            options={{ strokeColor: "#FF0000", fillColor: "#FF0000", fillOpacity: 0.2 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

TerrainSelector.propTypes = 
{
  onAreaSelect: PropTypes.func.isRequired, // Ensure onAreaSelect is a function and required
};

export default TerrainSelector;
