import { useEffect } from 'react';
import TerrainSelector from './components/GoogleMapModule/TerrainSelector';
import { fetchElevations } from './components/GoogleMapModule/FetchElevations';
import { setElevations } from './store/slices/ElevationDataSlice';
import { setDesignVolume, setNwl2hwl, setInteriorSlope, setBermWidth, setDaylightSlope, setHwl2fb, setOuterDimensions, setSl2nwl, setLedgeWidth, setSafetyLedge } from './store/slices/PondInputsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePondAreaAtHwl } from './components/functionalities';
import ModelViewer from './components/ThreeJSModule/ModelViewer';
import './index.css';

// Main Branch
export const App = () =>
{
    useEffect(() =>
    {
        alert("Please select an area on the map to proceed.");
    }, []);

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
    };

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
    };

    return (
        <div className="app-container">
            <div className="left-container">
                <div className="terrain-selector">
                    <TerrainSelector onAreaSelect={handleAreaSelect} />
                </div>

                <div className="model-viewer">
                    {areaSelected.north && <ModelViewer />}
                </div>
            </div>

            <div className="parameters-container">
                <h3 className="parameters-title">Pond Parameters</h3>

                {[
                    { label: "Design Volume", action: setDesignVolume },
                    { label: "NWL to HWL", action: setNwl2hwl },
                    { label: "Interior Slope", action: setInteriorSlope },
                    { label: "HWL to Freeboarding", action: setHwl2fb },
                    { label: "Safety Ledge to NWL", action: setSl2nwl },
                    { label: "Bottom to Safety Ledge", action: setSafetyLedge },
                    { label: "Berm Width", action: setBermWidth },
                    { label: "Daylight Slope", action: setDaylightSlope },
                    { label: "Ledge Width", action: setLedgeWidth },
                ].map(({ label, action }, index) => (
                    <div key={index} className="input-container">
                        <label className="input-label">{label}:</label>
                        <input
                            type="number"
                            className="input-field"
                            onChange={(e) =>
                                dispatch(action({ [label]: parseFloat(e.target.value) }))
                            }
                        />
                    </div>
                ))}

                <button
                    className="generate-btn"
                    onClick={generateLotDimensions}>
                    Generate Pond Structure
                </button>
            </div>
        </div>
    );
};
