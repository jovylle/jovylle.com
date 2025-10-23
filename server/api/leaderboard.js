export default defineEventHandler(async (event) => {
  try {
    // Fetch data from the reaction test API
    const response = await $fetch('https://fast.jovylle.com/reaction/top.json');
    
    // Set CORS headers to allow cross-origin requests
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    
    // Set CORS headers even for errors
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch leaderboard data'
    });
  }
});
