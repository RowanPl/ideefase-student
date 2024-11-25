// DOM Elements
const form = document.getElementById("ideefaseForm");
const previewDiv = document.getElementById("preview");
const generatePDFBtn = document.getElementById("generatePDF");
const backendFields = document.getElementById("backendFields");
const frontendFields = document.getElementById("frontendFields");

// Event Listeners
form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview); // Handles both text input and radio button changes
generatePDFBtn.addEventListener("click", generatePDF);

// Update Preview
function updatePreview() {
    const projectType = document.querySelector("input[name='projectType']:checked")?.value || "Geen projecttype opgegeven";
    const projectName = document.getElementById("projectName").value || "Geen projectnaam opgegeven";
    const kernFunctionaliteiten = document.getElementById("kernFunctionaliteiten").value || "Geen kernfunctionaliteiten opgegeven";
    const toelichting = document.getElementById("toelichting").value || "Geen toelichting opgegeven";

    let additionalFields = "";

    // Add Backend or Fullstack specific fields
    if (projectType === "Backend" || projectType === "Fullstack") {
        const entities = document.getElementById("entities").value || "Geen entiteiten opgegeven";
        const formattedEntities = entities.split('\n').map((item, index) => `${index + 1}. ${item}`).join('<br>');
        additionalFields += `<p><strong>Entiteiten:</strong><br>${formattedEntities}</p>`;
    }

    // Add Frontend specific fields
    if (projectType === "Frontend") {
        const backendType = document.getElementById("backendType").value || "Geen backend geselecteerd";
        const otherAPIs = document.getElementById("otherAPIs").value || "Geen API opgegeven";
        additionalFields += `<p><strong>Gekozen backend:</strong> ${backendType}</p>`;
        additionalFields += `<p><strong>Andere API's:</strong> ${otherAPIs}</p>`;
    }

    // Format Kernfunctionaliteiten with numbering
    const formattedKernFunctionaliteiten = kernFunctionaliteiten.split('\n').map((item, index) => `${index + 1}. ${item}`).join('<br>');

    // Update the preview dynamically
    previewDiv.innerHTML = `
        <h3 class="text-xl font-bold">${projectName}</h3>
        <p><strong>Toelichting:</strong><br>${toelichting}</p>
        <p><strong>Kernfunctionaliteiten:</strong><br>${formattedKernFunctionaliteiten}</p>
        ${additionalFields}
    `;

    handleFieldVisibility(); // Ensure fields' visibility updates
}

// Handle Visibility of Fields Based on Project Type
function handleFieldVisibility() {
    const projectType = document.querySelector("input[name='projectType']:checked")?.value;

    // Show/Hide Backend/Fullstack Fields
    backendFields.classList.toggle("hidden", !(projectType === "Backend" || projectType === "Fullstack"));

    // Show/Hide Frontend Fields
    frontendFields.classList.toggle("hidden", projectType !== "Frontend");
}

// Generate PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Retrieve form values
    const projectType = document.querySelector("input[name='projectType']:checked")?.value || "Niet geselecteerd";
    const projectName = document.getElementById("projectName").value || "Geen projectnaam opgegeven";
    const toelichting = document.getElementById("toelichting").value || "Geen toelichting opgegeven";
    const kernFunctionaliteiten = document.getElementById("kernFunctionaliteiten").value || "Geen kernfunctionaliteiten opgegeven";

    // Setup title and document metadata
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Project Voorstel", 105, 15, { align: "center" }); // Center-aligned title
    // Add Project Name and Type Section
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
    kernFunctionaliteiten.split("\n").forEach((item, index) => {
        doc.text(`${index + 1}. ${item.trim()}`, 10, 120 + index * 10);
    });

    // Add Backend/Fullstack Specific Details
    let yOffset = 120 + kernFunctionaliteiten.split("\n").length * 10 + 10;
    if (projectType === "Backend" || projectType === "Fullstack") {
        const entities = document.getElementById("entities").value || "Geen entiteiten opgegeven";

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Entiteiten", 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        entities.split("\n").forEach((item, index) => {
            doc.text(`${index + 1}. ${item.trim()}`, 10, yOffset + 10 + index * 10);
        });
        yOffset += entities.split("\n").length * 10 + 20;
    }

    // Add Frontend Specific Details
    if (projectType === "Frontend") {
        const backendType = document.getElementById("backendType").value || "Geen backend geselecteerd";
        const otherAPIs = document.getElementById("otherAPIs").value || "Geen andere API's";

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Frontend Details", 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Gekozen backend: ${backendType}`, 10, yOffset + 10);
        doc.text(`Andere API's: ${otherAPIs}`, 10, yOffset + 20);
    }

    // Add Footer with Page Number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Pagina ${i} van ${pageCount}`, 105, 290, { align: "center" });
    }

    // Save the generated PDF
    doc.save(`${projectName || "Project"}_Voorstel.pdf`);
}
