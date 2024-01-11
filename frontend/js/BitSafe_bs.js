const backendUrl = "https://your-backend-url.com/api/getCredentials";
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message && message.type === "getDummyCredentials") {
        try {
            const response = await fetch(backendUrl);
            const data = await response.json();
            const credentials = {
                username: data.username,
                password: data.password,
            };           
            sendResponse(credentials);
        } catch (error) {
            console.error("Error fetching credentials from the backend:", error);
            sendResponse(null);
        }
    }
});
