// DOM Elements
const form = document.getElementById("ideefaseForm");
const previewDiv = document.getElementById("preview");
const backendFields = document.getElementById("backendFields");
const frontendFields = document.getElementById("frontendFields");
const kernFunctionaliteitenContainer = document.getElementById("kernFunctionaliteitenContainer");
const addKernFunctionaliteitBtn = document.getElementById("addKernFunctionaliteit");
const generatePDFButton = document.getElementById('generatePDF');


//on load hide the backend and frontend fields
backendFields.classList.toggle("hidden", false);
// Event Listeners


form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview); // Handles both text input and radio button changes
// generatePDFBtn.addEventListener("click", generatePDF);
// Event Listener for Adding More Functionalities
addKernFunctionaliteitBtn.addEventListener("click", () => {
    const newField = document.createElement("div");
    newField.classList.add("functionaliteit-item", "flex", "items-center", "space-x-2");

    const fieldCount = kernFunctionaliteitenContainer.querySelectorAll(".kern-functionaliteit").length + 1;

    newField.innerHTML = `
        <input type="text" class="form-input kern-functionaliteit flex-grow" placeholder="Functionaliteit ${fieldCount}" required>
        <button type="button" class="btn-remove btn-danger text-sm px-2 py-1">-</button>
    `;

    // Add event listener for removing the field
    const removeButton = newField.querySelector(".btn-remove");
    removeButton.addEventListener("click", () => {
        newField.remove();
        updateFunctionaliteitPlaceholders();
        updatePreview();
    });

    kernFunctionaliteitenContainer.appendChild(newField);
});

// Update Preview
function updatePreview() {
    const projectType = document.querySelector("input[name='projectType']:checked")?.value || "Geen projecttype opgegeven";
    const projectName = document.getElementById("projectName").value || "Geen projectnaam opgegeven";
    const toelichting = document.getElementById("toelichting").value || "Geen toelichting opgegeven";

    // Retrieve all Kernfunctionaliteiten
    const kernFunctionaliteitenFields = Array.from(kernFunctionaliteitenContainer.querySelectorAll(".kern-functionaliteit"));
    const kernFunctionaliteiten = kernFunctionaliteitenFields
        .map((field, index) => `${index + 1}. ${field.value || "Geen functionaliteit opgegeven"}`)
        .join("<br>");

    let additionalFields = "";

    // Add Backend or Fullstack specific fields
    if (projectType === "Backend" || projectType === "Fullstack") {
        const entities = document.getElementById("entities").value || "Geen entiteiten opgegeven";
        const formattedEntities = entities.split("\n").map((item, index) => `${index + 1}. ${item}`).join("<br>");
        additionalFields += `<p><strong>Entiteiten:</strong><br>${formattedEntities}</p>`;
    }

    // Add Frontend specific fields
    if (projectType === "Frontend") {
        const backendType = document.getElementById("backendType").value || "Geen backend geselecteerd";
        const otherAPIs = document.getElementById("otherAPIs").value || "Geen API opgegeven";
        additionalFields += `<p><strong>Gekozen backend:</strong> ${backendType}</p>`;
        additionalFields += `<p><strong>Andere API's:</strong> ${otherAPIs}</p>`;
    }

    // Update the preview dynamically
    previewDiv.innerHTML = `
        <h3 class="text-xl font-bold">${projectName}</h3>
        <p><strong>Toelichting:</strong><br>${toelichting}</p>
        <p><strong>Kernfunctionaliteiten:</strong><br>${kernFunctionaliteiten}</p>
        ${additionalFields}
    `;

    handleFieldVisibility();
}
const validateForm = () => {
    let isValid = true;

    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((error) => error.remove());

    const displayError = (element, message) => {
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        errorElement.innerText = message;
        element.parentElement.appendChild(errorElement);
    };

    // Check project name
    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput.value.trim();
    if (projectName === '') {
        displayError(projectNameInput, 'Projectnaam is verplicht.');
        isValid = false;
    }

    // Check toelichting
    const toelichtingInput = document.getElementById('toelichting');
    const toelichting = toelichtingInput.value.trim();
    if (toelichting === '') {
        displayError(toelichtingInput, 'Toelichting is verplicht.');
        isValid = false;
    }

    // Check kern functionaliteiten
    const functionaliteiten = document.querySelectorAll('.kern-functionaliteit');
    functionaliteiten.forEach((field, index) => {
        if (field.value.trim() === '') {
            displayError(field, `Functionaliteit ${index + 1} is verplicht.`);
            isValid = false;
        }
    });

    // Additional validation for specific fields
    const projectType = document.querySelector('input[name="projectType"]:checked').value;
    if (projectType === 'Backend' || projectType === 'Fullstack') {
        const entitiesInput = document.getElementById('entities');
        const entities = entitiesInput.value.trim();
        if (entities === '') {
            displayError(entitiesInput, 'Entiteiten zijn verplicht voor Backend of Fullstack projecten.');
            isValid = false;
        }
    } else if (projectType === 'Frontend') {
        const backendTypeInput = document.getElementById('backendType');
        const backendType = backendTypeInput.value;
        if (!backendType) {
            displayError(backendTypeInput, 'Backend type is verplicht voor Frontend projecten.');
            isValid = false;
        } else {
            element.classList.remove("border-red-500"); // Remove red border from valid elements
        }
    }

    return isValid;
};

// Attach validation to form submission
document.getElementById('ideefaseForm').addEventListener('submit', (event) => {
    console.log('Form submission initiated');
    event.preventDefault();
    if (!validateForm()) {
        console.log('Form submission prevented');
    } else {
        console.log('Form is valid');
        generatePDF();
    }
});

function handleFieldVisibility() {
    const projectType = document.querySelector("input[name='projectType']:checked")?.value;

    // Show/Hide Backend/Fullstack Fields
    backendFields.classList.toggle("hidden", !(projectType === "Backend" || projectType === "Fullstack"));

    // Show/Hide Frontend Fields
    frontendFields.classList.toggle("hidden", projectType !== "Frontend");
}

// Attach validation to form submission
document.getElementById('ideefaseForm').addEventListener('submit', (event) => {
    console.log('Form submission initiated');
    event.preventDefault();
    if (!validateForm()) {
        console.log('Form submission prevented');
    } else {
        console.log('Form is valid');
        generatePDF();
    }
});

// Generate PDF
function generatePDF() {
    console.log('Generating PDF...');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Retrieve form values
    const projectType = document.querySelector("input[name='projectType']:checked")?.value || "Niet geselecteerd";
    const projectName = document.getElementById("projectName").value || "Geen projectnaam opgegeven";
    const toelichting = document.getElementById("toelichting").value || "Geen toelichting opgegeven";

    let additionalFields = '';
    let additionalTitle = '';

    if (projectType === 'Backend' || projectType === 'Fullstack') {
        additionalFields = document.getElementById('entities').value || "Geen entiteiten opgegeven";
        additionalTitle = "Entiteiten";
    } else if (projectType === 'Frontend') {
        const backendType = document.getElementById('backendType').value || "Geen backend geselecteerd";
        const otherAPIs = document.getElementById('otherAPIs').value || "Geen API's opgegeven";
        additionalFields = `Gekozen Backend: ${backendType}\nGekozen API: ${otherAPIs}`;
        additionalTitle = "Backend en API";
    }

    // Retrieve all Kernfunctionaliteiten
    const kernFunctionaliteitenFields = Array.from(
        kernFunctionaliteitenContainer.querySelectorAll(".kern-functionaliteit")
    );

    const kernFunctionaliteiten = kernFunctionaliteitenFields
        .filter(field => field.value.trim() !== "") // Exclude empty or whitespace-only values
        .map((field, index) => `${index + 1}. ${field.value}`);


    // Add title and metadata
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Project Voorstel", 105, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Projectnaam: ${projectName}`, 10, 45);
    doc.text(`Projecttype: ${projectType}`, 10, 55);

    // Add Toelichting Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Toelichting", 10, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(toelichting, 180), 10, 80);

    // Add Kernfunctionaliteiten Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Kernfunctionaliteiten", 10, 110);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    kernFunctionaliteiten.forEach((item, index) => {
        doc.text(item, 10, 120 + index * 10);
    });

    // Add Additional Fields with Specific Title
    if (additionalFields) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(additionalTitle, 10, 160);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(additionalFields, 180), 10, 170);
    }

    // Save PDF
    doc.save(`${projectName || "Project"}_Voorstel.pdf`);
}