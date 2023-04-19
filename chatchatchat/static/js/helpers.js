function showTopError(text) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = text;
    errorMessage.style.backgroundColor = '#e9e9e9';
    errorMessage.style.width = "60%"
    errorMessage.style.padding = '10px';
    errorMessage.style.borderRadius = "5px";
    errorMessage.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
    errorMessage.style.position = 'fixed';
    errorMessage.style.top = '20px';
    errorMessage.style.left = '50%';
    errorMessage.style.transform = 'translateX(-50%)';
    errorMessage.style.zIndex = '9999';
    document.body.appendChild(errorMessage);
    setTimeout(() => {
        errorMessage.style.transition = 'opacity 1s ease-in-out';
        errorMessage.style.opacity = '0';
        setTimeout(() => {
            errorMessage.parentNode.removeChild(errorMessage);
        }, 1000);
    }, 2000);
}
export { showTopError }