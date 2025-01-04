const getCookies =  (name) => {
    // Get all cookies as a string
    const cookies = document.cookie;
    console.log("cookies : ",cookies)
    // Format the name to match cookie format
    const nameEQ = `${name}=`;
    const ca = cookies.split(';');

    // Loop through each cookie string
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length); // Strip leading spaces
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length); // Return cookie value
        }
    }
    return null; // Return null if cookie is not found
}

export default getCookies;