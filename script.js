// Symptom database with associated conditions
const symptomsDB = [
    { id: 1, name: "Fever", conditions: ["Flu", "Common Cold", "COVID-19", "Pneumonia"] },
    { id: 2, name: "Cough", conditions: ["Common Cold", "Flu", "COVID-19", "Bronchitis"] },
    { id: 3, name: "Headache", conditions: ["Migraine", "Tension Headache", "Dehydration", "Sinusitis"] },
    { id: 4, name: "Sore Throat", conditions: ["Common Cold", "Strep Throat", "COVID-19", "Tonsillitis"] },
    { id: 5, name: "Runny Nose", conditions: ["Common Cold", "Allergies", "Sinusitis", "Flu"] },
    { id: 6, name: "Shortness of Breath", conditions: ["Asthma", "COVID-19", "Pneumonia", "Anxiety"] },
    { id: 7, name: "Chest Pain", conditions: ["Angina", "Heart Attack", "Acid Reflux", "Pneumonia"] },
    { id: 8, name: "Nausea", conditions: ["Food Poisoning", "Migraine", "Stomach Flu", "Pregnancy"] },
    { id: 9, name: "Dizziness", conditions: ["Dehydration", "Inner Ear Problem", "Low Blood Pressure", "Anemia"] },
    { id: 10, name: "Fatigue", conditions: ["Anemia", "Depression", "Sleep Apnea", "Hypothyroidism"] },
    { id: 11, name: "Muscle Aches", conditions: ["Flu", "Fibromyalgia", "Lyme Disease", "Autoimmune Disorder"] },
    { id: 12, name: "Rash", conditions: ["Allergic Reaction", "Eczema", "Measles", "Chickenpox"] }
];

// Medical recommendations for different conditions
const recommendationsDB = {
    "Common Cold": "Rest, drink plenty of fluids, and consider over-the-counter cold remedies.",
    "Flu": "Rest, hydrate, and consider antiviral medications if caught early.",
    "COVID-19": "Isolate yourself, rest, monitor symptoms, and seek medical attention if breathing difficulties occur.",
    "Allergies": "Avoid allergens, consider antihistamines, and use nasal sprays as needed.",
    "Migraine": "Rest in a dark room, stay hydrated, and consider pain relievers or prescription medications.",
    "Strep Throat": "See a doctor for antibiotics, rest, and drink warm liquids to soothe throat.",
    "Asthma": "Use prescribed inhalers, avoid triggers, and seek emergency care if severe breathing difficulties occur.",
    "Anxiety": "Practice relaxation techniques, consider therapy, and in some cases medication may be helpful.",
    "Food Poisoning": "Stay hydrated, eat bland foods, and rest. Seek medical care if symptoms are severe."
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const symptomsList = document.getElementById('symptomsList');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsText = document.getElementById('resultsText');
    const recommendationsDiv = document.getElementById('recommendations');
    
    // Populate symptoms checklist
    symptomsDB.forEach(symptom => {
        const label = document.createElement('label');
        label.className = 'symptom-checkbox';
        label.innerHTML = `
            <input type="checkbox" id="symptom-${symptom.id}" value="${symptom.id}">
            ${symptom.name}
        `;
        symptomsList.appendChild(label);
    });
    
    // Analyze symptoms when button is clicked
    analyzeBtn.addEventListener('click', function() {
        const selectedSymptoms = getSelectedSymptoms();
        
        if (selectedSymptoms.length === 0) {
            alert('Please select at least one symptom.');
            return;
        }
        
        const possibleConditions = predictConditions(selectedSymptoms);
        displayResults(possibleConditions);
    });
    
    // Reset the form
    resetBtn.addEventListener('click', function() {
        resetForm();
    });
    
    // Get selected symptoms from checkboxes
    function getSelectedSymptoms() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => parseInt(cb.value));
    }
    
    // Predict conditions based on selected symptoms
    function predictConditions(selectedSymptomIds) {
        // Get the symptom objects for selected IDs
        const selectedSymptoms = symptomsDB.filter(s => selectedSymptomIds.includes(s.id));
        
        // Count occurrences of each condition
        const conditionCounts = {};
        selectedSymptoms.forEach(symptom => {
            symptom.conditions.forEach(condition => {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            });
        });
        
        // Convert to array and sort by frequency
        return Object.entries(conditionCounts)
            .map(([condition, count]) => ({ condition, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    // Display results to the user
    function displayResults(possibleConditions) {
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Format results text
        if (possibleConditions.length > 0) {
            const topConditions = possibleConditions.slice(0, 3);
            resultsText.innerHTML = `Based on your symptoms, the most likely conditions are:<br><br>`;
            
            topConditions.forEach(cond => {
                const percentage = Math.min(95, (cond.count / possibleConditions[0].count) * 100).toFixed(0);
                resultsText.innerHTML += `
                    <strong>${cond.condition}</strong> (${percentage}% match)<br>
                `;
            });
            
            // Show recommendations for the top condition if available
            const topCondition = topConditions[0].condition;
            if (recommendationsDB[topCondition]) {
                recommendationsDiv.innerHTML = `
                    <h3>Recommendations for ${topCondition}:</h3>
                    <p>${recommendationsDB[topCondition]}</p>
                    <p><em>Remember: This is not medical advice. Please consult a healthcare professional for proper diagnosis.</em></p>
                `;
            } else {
                recommendationsDiv.innerHTML = `
                    <p><em>Please consult a healthcare professional for proper diagnosis and treatment.</em></p>
                `;
            }
        } else {
            resultsText.textContent = "No specific conditions identified based on your symptoms.";
            recommendationsDiv.innerHTML = `
                <p><em>If symptoms persist or worsen, please consult a healthcare professional.</em></p>
            `;
        }
    }
    
    // Reset the form
    function resetForm() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Hide results section
        resultsSection.classList.add('hidden');
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});