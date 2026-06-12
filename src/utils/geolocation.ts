export function getGeolocationErrorMessage(
  error: Pick<GeolocationPositionError, "code">
): string {
  switch (error.code) {
    case 1:
      return "Location permission is blocked. Allow location access for this site in your browser settings, then try again.";
    case 2:
      return "Your device could not determine its current location. Check location services and try again.";
    case 3:
      return "Getting your location took too long. Try again or search for your city.";
    default:
      return "Unable to retrieve your location. Try again or search for your city.";
  }
}
