
// Fetches elevations for a given area and resolution
// Returns an array of elevations and the grid size
export const fetchElevations = async (selectedArea, resolution) =>
{
    const { north: maxLat, south: minLat, east: maxLong, west: minLong } = selectedArea;
      const meterToDegree = 0.000009;
      const stepSizeLat = resolution * meterToDegree;
      const stepSizeLongBase = resolution * meterToDegree;
  
      let interpolatedPoints = [];
      let gridX = 0, gridY = 0;
  
      for (let lat = minLat; lat <= maxLat; lat += stepSizeLat) 
      {
          const stepSizeLong = stepSizeLongBase / Math.cos(lat * (Math.PI / 180));
          let rowPoints = [];
  
          for (let lng = minLong; lng <= maxLong; lng += stepSizeLong) 
          {
              rowPoints.push({ lat, lng });
          }
  
          if (gridX === 0) gridX = rowPoints.length; // Fix grid width
          interpolatedPoints.push(...rowPoints);
      }
  
      gridY = interpolatedPoints.length / gridX; // Fix grid height
  
      console.log(`Grid size: ${gridX} x ${gridY} (Total points: ${interpolatedPoints.length})`);
  
      const elevator = new window.google.maps.ElevationService();
      const locations = interpolatedPoints.map(p => ({ lat: p.lat, lng: p.lng }));
  
      try 
      {
          const results = await elevator.getElevationForLocations({ locations });
          return { results: results.results.map(res => res.elevation), gridX, gridY };
      } 
      catch (e) 
      {
          console.log("Cannot show elevation: request failed because " + e);
          return null;
      }
}