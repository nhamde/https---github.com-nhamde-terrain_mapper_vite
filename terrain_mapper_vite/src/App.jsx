import TerrainSelector from './components/GoogleMapModule/TerrainSelector'
import { fetchElevations } from './components/GoogleMapModule/FetchElevations';
import { setElevations } from './store/slices/ElevationDataSlice';
import { setDesignVolume, setNwl2hwl, setInteriorSlope, setBermWidth, setDaylightSlope, setHwl2fb, setOuterDimensions, setSl2nwl, setLedgeWidth, setSafetyLedge } from './store/slices/PondInputsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePondAreaAtHwl } from './components/functionalities';
import ModelViewer from './components/ThreeJSModule/ModelViewer';
import './App.css'

export const App = () => 
{

  const dispatch = useDispatch();
  const nwl2hwl = useSelector((state) => state.PondInputsSetter.nwl2hwl);
  const designVolume = useSelector((state) => state.PondInputsSetter.designVolume);
  const interiorSlope = useSelector((state) => state.PondInputsSetter.interiorSlope);
  const hwl2fb = useSelector((state) => state.PondInputsSetter.hwl2fb);
  const bermWidth = useSelector((state) => state.PondInputsSetter.bermWidth);
  const areaSelected = useSelector((state) => state.areaSelector);

  const handleAreaSelect = async (selectedArea) => 
  {
    const elevations = await fetchElevations(selectedArea, 10);
    dispatch(setElevations(elevations));
  }
  const generateLotDimensions = () =>
  {
    console.log(designVolume, nwl2hwl, interiorSlope, hwl2fb, bermWidth);
    if (designVolume && nwl2hwl && interiorSlope && hwl2fb && bermWidth)
    {
      const pondSqAreaAtHwl = calculatePondAreaAtHwl(designVolume, nwl2hwl);
      const pondSqSideAtFb = Math.sqrt(pondSqAreaAtHwl) + 2 * interiorSlope * hwl2fb;
      const pondSqSideAtBerm = pondSqSideAtFb + 2 * bermWidth;
      dispatch(setOuterDimensions({ outerLength: pondSqSideAtBerm, outerWidth: pondSqSideAtBerm }));
    }
    else
    {
      console.log("Please fill in all data");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100vw", height: "100vh" }}>
      
      {/* Left side - ModelViewer & TerrainSelector (Stacked vertically) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <h2 style={{ textAlign: "center", marginTop: "10px" }}>Please select an area on the map</h2>
        
        {/* TerrainSelector */}
        <div style={{ flex: 1, minHeight: "50%" }}>
          <TerrainSelector onAreaSelect={handleAreaSelect} />
        </div>
  
        {/* ModelViewer */}
        <div style={{ flex: 1, minHeight: "50%" }}>
          {areaSelected.north && <ModelViewer />}
        </div>
      </div>
  
      {/* Right side - Inputs */}
      <div style={{ flex: 2, width: "400px", borderLeft: "2px solid #ccc", background: "#f8f8f8" }}>
        <h3>Pond Parameters</h3>
        <label>Design Volume: <input type="number" onChange={(e) => dispatch(setDesignVolume({ designVolume: parseFloat(e.target.value) }))} /></label><br/>
        <label>NWL to HWL: <input type="number" onChange={(e) => dispatch(setNwl2hwl({ nwl2hwl: parseFloat(e.target.value) }))} /></label><br/>
        <label>Interior Slope: <input type="number" onChange={(e) => dispatch(setInteriorSlope({ interiorSlope: parseFloat(e.target.value) }))} /></label><br/>
        <label>HWL to Freeboarding: <input type="number" onChange={(e) => dispatch(setHwl2fb({ hwl2fb: parseFloat(e.target.value) }))} /></label><br/>
        <label>Safety Ledge to NWL: <input type="number" onChange={(e) => dispatch(setSl2nwl({ sl2nwl: parseFloat(e.target.value) }))} /></label><br/>
        <label>Bottom to Safety Ledge: <input type="number" onChange={(e) => dispatch(setSafetyLedge({ safetyLedge: parseFloat(e.target.value) }))} /></label><br/>
        <label>Berm Width: <input type="number" onChange={(e) => dispatch(setBermWidth({ bermWidth: parseFloat(e.target.value) }))} /></label><br/>
        <label>Daylight Slope: <input type="number" onChange={(e) => dispatch(setDaylightSlope({ daylightSlope: parseFloat(e.target.value) }))} /></label><br/>
        <label>Ledge Width: <input type="number" onChange={(e) => dispatch(setLedgeWidth({ ledgeWidth: parseFloat(e.target.value) }))} /></label><br/>
        <button onClick={generateLotDimensions} style={{ marginTop: "10px", padding: "8px 12px" }}>
          Generate Pond Structure
        </button>
      </div>
    </div>
  );
  
}
