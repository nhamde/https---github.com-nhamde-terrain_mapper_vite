import { configureStore } from '@reduxjs/toolkit';
import areaSelectorReducer from './slices/AreaSelectionSlice';
import elevationDataReducer from './slices/ElevationDataSlice';
import planeSizeReducer from './slices/PlaneSizeSlice';
import pondInputsReducer from './slices/PondInputsSlice';

const Store = configureStore (
    {
        reducer: 
        {
            areaSelector : areaSelectorReducer,
            elevationDataSetter : elevationDataReducer,
            planeSizeSetter : planeSizeReducer,
            PondInputsSetter : pondInputsReducer,
        }
    }
)

export default Store;