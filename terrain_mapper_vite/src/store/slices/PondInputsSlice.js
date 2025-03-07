import  {createSlice} from '@reduxjs/toolkit';

export const pondInputsSlice = createSlice(
    {
        name: 'PondInputs',
        initialState:
        {
            designVolume: 6000,
            nwl2hwl: 10,
            bermWidth: 3,
            interiorSlope: 1.5,
            daylightSlope: 1,
            hwl2fb: 8,
            outerLength: null,
            outerWidth: null,
            sl2nwl: 6,
            safetyLedge: 5,
            ledgeWidth: 3,
            pondPositionZOffset: null
        },
        reducers:
        {
            setPondPositionZOffset: (state, action) =>
            {
                state.pondPositionZOffset = action.payload;
            },
            setDesignVolume: (state, action) =>
            {
                state.designVolume = action.payload.designVolume;
            },
            setNwl2hwl: (state, action) =>
            {
                state.nwl2hwl = action.payload.nwl2hwl;
            },
            setInteriorSlope: (state, action) =>
            {
                state.interiorSlope = action.payload.interiorSlope;
            },
            setBermWidth: (state, action) =>
            {
                state.bermWidth = action.payload.bermWidth;
            },
            setDaylightSlope: (state, action) =>
            {
                state.daylightSlope = action.payload.daylightSlope;
            },
            setHwl2fb: (state, action) =>
            {
                state.hwl2fb = action.payload.hwl2fb;
            },
            setOuterDimensions: (state, action) =>
            {
                state.outerLength = action.payload.outerLength;
                state.outerWidth = action.payload.outerWidth;
            },
            setSl2nwl: (state, action) =>
            {
                state.sl2nwl = action.payload.sl2nwl;
            },
            setSafetyLedge: (state, action) =>
            {
                state.safetyLedge = action.payload.safetyLedge;
            },
            setLedgeWidth: (state, action) =>
            {
                state.ledgeWidth = action.payload.ledgeWidth;
            }
        }
    });

export const {setPondPositionZOffset, setDesignVolume, setNwl2hwl, setInteriorSlope, setBermWidth, setDaylightSlope, setHwl2fb, setOuterDimensions, setSl2nwl, setSafetyLedge, setLedgeWidth} = pondInputsSlice.actions;
export default pondInputsSlice.reducer;