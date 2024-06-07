document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Set initial theme based on localStorage or system preference
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.checked = currentTheme === 'dark';
    } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        localStorage.setItem('theme', systemTheme);
        themeToggle.checked = systemTheme === 'dark';
    }

    // Function to toggle theme
    function toggleTheme() {
        const theme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Event listener for theme toggle
    themeToggle.addEventListener('change', toggleTheme);

    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('welcome-box').classList.add('hidden');
        document.getElementById('customization-box').classList.remove('hidden');
    });

    document.getElementById('generate-button').addEventListener('click', () => {
        const style = document.getElementById('style').value;
        const seed = document.getElementById('seed').value;
        const fileType = document.querySelector('input[name="file-type"]:checked').value;
        const flip = document.querySelector('input[name="flip"]:checked').value;
        const apiUrl = `https://api.dicebear.com/8.x/${style}/${fileType}?seed=${seed}&flip=${flip}`;

        fetch(apiUrl)
            .then(response => {
                if (fileType === 'svg') {
                    return response.text();
                } else {
                    return response.blob();
                }
            })
            .then(data => {
                const img = document.getElementById('avatar-image');
                const downloadButton = document.getElementById('download-button');
                if (fileType === 'svg') {
                    const blob = new Blob([data], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    img.src = url;
                    img.dataset.downloadUrl = url;
                    downloadButton.disabled = false;
                } else {
                    const url = URL.createObjectURL(data);
                    img.src = url;
                    img.dataset.downloadUrl = url;
                    downloadButton.disabled = false;
                }
            })
            .catch(error => console.error('Error generating avatar:', error));
    });

    // Add event listener for download button
    document.getElementById('download-button').addEventListener('click', () => {
        const img = document.getElementById('avatar-image');
        const downloadUrl = img.dataset.downloadUrl;
        if (downloadUrl) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'avatar';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
});
