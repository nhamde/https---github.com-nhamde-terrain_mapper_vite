import { createSlice } from "@reduxjs/toolkit";

export const elevationDataSlice = createSlice(
    {
        name: 'ElevationData',
        initialState:
        {
            elevationData: [],
            gridX : null,
            gridY : null
        },
        reducers: 
        {
            setElevations : (state ,action) =>
            {
                state.elevationData = [...action.payload.results];
                state.gridX = action.payload.gridX;
                state.gridY = action.payload.gridY;
            }
        }
    }
);

export const {setElevations} = elevationDataSlice.actions;

export default elevationDataSlice.reducer;