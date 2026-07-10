class MapBoxSearch {
  private MAPBOX_TOKEN = process.env.EXPO_MAPBOX_PUBLIC_TOKEN;
  async getSuggestion(value: string, sessionToken: string) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
          value,
        )}&language=en&limit=10&session_token=${sessionToken}&access_token=${this.MAPBOX_TOKEN}`,
      );
      const data = await response.json();
      return data.suggestions ?? [];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async retrive(mapbox_id: string, sessionToken: string) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}?session_token=${sessionToken}&access_token=${this.MAPBOX_TOKEN}`,
      );
      const data = await response.json();
      return data.features;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
export default new MapBoxSearch();
