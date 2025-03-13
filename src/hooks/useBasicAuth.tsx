
export const useBasicAuth = () => {
  const generateBasicAuth = () => {
    try {
      // Credentials for Basic Auth
      const username = "toto";
      const password = "123456789";
      
      // Create the Basic Auth string: "Basic " + base64(username:password)
      const credentials = `${username}:${password}`;
      const base64Credentials = btoa(credentials);
      return `Basic ${base64Credentials}`;
    } catch (error) {
      console.error("Error generating Basic Auth:", error);
      return null;
    }
  };

  return { generateBasicAuth };
};
