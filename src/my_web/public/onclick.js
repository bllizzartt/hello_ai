function productClicked(element) {
    const url = element.getAttribute('data-url'); // Ensure this is getting the correct URL
    window.location.href = url; // Redirects the browser to the specified URL
}
