document.addEventListener("DOMContentLoaded", () => {
    
    // 1. DYNAMIC SCORE COUNT-UP
    const animateScore = () => {
        const scoreElement = document.getElementById('mobility-score');
        if (!scoreElement) return; // Failsafe if element doesn't exist
        
        const targetScore = 82;
        let currentScore = 0;
        const speed = 25; 

        const updateScore = () => {
            if (currentScore < targetScore) {
                currentScore++;
                scoreElement.innerText = currentScore;
                setTimeout(updateScore, speed);
            }
        }
        updateScore();
    }
    setTimeout(animateScore, 500);

    // 2. HERO BUTTON - JUST CONFETTI
    const startTrainingBtn = document.getElementById("start-training");
    if (startTrainingBtn) {
        startTrainingBtn.addEventListener("click", (event) => {
            const rect = event.target.getBoundingClientRect();
            confetti({
                particleCount: 60,
                spread: 70,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                },
                colors: ['#CCFF00', '#FFFFFF', '#1A1C1E']
            });
        });
    }

    // 3. FULLSTACK INTEGRATION (LOG HOLD BUTTON)
    const logHoldBtn = document.getElementById("log-hold");
    if (logHoldBtn) {
        logHoldBtn.addEventListener("click", async (event) => {
            const originalText = event.target.innerHTML;
            event.target.innerHTML = `<i class="ph ph-spinner ph-spin"></i> SYNCING...`;

            try {
                // Send data to our FastAPI backend
                const response = await fetch("http://localhost:8000/api/log-hold", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        exercise: "FRONT LEVER",
                        duration: 45.2,
                        protocol: "HYPERTROPHY PROTOCOL ALPHA"
                    })
                });

                const data = await response.json();

                // If the backend validates the data, trigger the gamified reward
                if (data.status === "success") {
                    const rect = event.target.getBoundingClientRect();
                    confetti({
                        particleCount: 60,
                        spread: 70,
                        origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top + rect.height / 2) / window.innerHeight
                        },
                        colors: ['#CCFF00', '#FFFFFF', '#1A1C1E']
                    });
                    
                    event.target.innerHTML = `<i class="ph-fill ph-check-circle"></i> SECURED`;
                }
            } catch (error) {
                console.error("Backend offline:", error);
                event.target.innerHTML = `<i class="ph-fill ph-warning"></i> SYSTEM OFFLINE`;
            }

            // Reset button after 3 seconds
            setTimeout(() => {
                event.target.innerHTML = originalText;
            }, 3000);
        });
    }
});