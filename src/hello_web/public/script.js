document.getElementById('yesButton').addEventListener('click', function() {
    // Hide the entrance wall
    document.getElementById('entranceWall').style.display = 'none';
    
    // Play the audio
    var audio = document.getElementById('backgroundMusic');
    audio.play();
});