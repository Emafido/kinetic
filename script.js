document.addEventListener("DOMContentLoaded", () => {
    
    // Gamification: Success Trigger on Primary Actions
    const startTrainingBtn = document.getElementById("start-training");
    const logHoldBtn = document.getElementById("log-hold");

    const triggerNeonConfetti = (event) => {
        // Get button coordinates to fire confetti from the button itself
        const rect = event.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: x, y: y },
            colors: ['#CCFF00', '#FFFFFF', '#1A1C1E'] // Custom brand colors
        });
        
        // Optional: Change text momentarily to show interaction
        const originalText = event.target.innerHTML;
        event.target.innerHTML = `<i class="ph-fill ph-check-circle"></i> LOGGED`;
        setTimeout(() => {
            event.target.innerHTML = originalText;
        }, 2000);
    };

    startTrainingBtn.addEventListener("click", triggerNeonConfetti);
    if(logHoldBtn) logHoldBtn.addEventListener("click", triggerNeonConfetti);
});

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