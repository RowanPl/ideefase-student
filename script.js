
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ideation-phase-form");
    const projectTypeInputs = document.querySelectorAll("input[name='project-type']");
    const backendFields = document.getElementById("backend-fields");
    const frontendFields = document.getElementById("frontend-fields");
    const preview = document.getElementById("preview");
    const generatePdfButton = document.getElementById("generate-pdf");
    const coreFeaturesContainer = document.getElementById("core-features-container");
    const addCoreFeatureButton = document.getElementById("add-core-feature");


    // Toggle fields based on project type
    projectTypeInputs.forEach((input) => {
        input.addEventListener("change", (e) => {
            const selectedType = e.target.value;
            backendFields.classList.toggle("hidden", selectedType !== "Backend" && selectedType !== "Fullstack");
            frontendFields.classList.toggle("hidden", selectedType !== "Frontend");
        });
    });

    addCoreFeatureButton.addEventListener("click", () => {
        const featureWrapper = document.createElement("div");
        featureWrapper.classList.add("core-feature-wrapper");

        const newFeatureInput = document.createElement("input");
        newFeatureInput.classList.add("core-feature", "form-textarea");
        newFeatureInput.setAttribute("rows", "5");
        newFeatureInput.setAttribute("placeholder", `Kernfunctionaliteit ${coreFeaturesContainer.children.length + 1}: ...`);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("btn", "btn-secondary", "remove-core-feature");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            coreFeaturesContainer.removeChild(featureWrapper);
        });

        featureWrapper.appendChild(newFeatureInput);
        featureWrapper.appendChild(removeButton);
        coreFeaturesContainer.appendChild(featureWrapper);
    });

    // Update preview
    const updatePreview = () => {
        const projectName = document.getElementById("project-name").value;
        const description = document.getElementById("description").value;
        const coreFeatures = Array.from(document.querySelectorAll(".core-feature")).map(input => input.value).join(", ");
        const entities = document.getElementById("entities")?.value || "";
        const backendType = document.getElementById("backend-type")?.value || "";
        const otherApis = document.getElementById("other-apis")?.value || "";
        const projectType = document.querySelector("input[name='project-type']:checked")?.value;
        preview.innerHTML = `
      <h3 class="text-lg font-semibold">Project Preview</h3>
      <p><strong>Naam van je applicatie:</strong> ${projectName || "N/A"}</p>
      <p><strong>Toelichting:</strong> ${description || "N/A"}</p>
      <p><strong>Kernfunctionaliteiten:</strong> ${coreFeatures || "N/A"}</p>
      ${projectType === "Backend" || projectType === "Fullstack" ? `<p><strong>Entiteiten:</strong> ${entities}</p>` : ""}
      ${projectType === "Frontend" ? `<p><strong>Backend Keuze:</strong> ${backendType}</p>` : ""}
      ${projectType === "Frontend" ? `<p><strong>Gekozen REST API:</strong> ${otherApis}</p>` : ""}
    `;
    };

    form.addEventListener("input", updatePreview);

    // Generate PDF
    generatePdfButton.addEventListener("click", () => {
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();

        // Color palette
        const colors = {
            primary: '#da6b32', secondary: '#ba4801', text: '#333333'
        };

        // Page setup
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let currentY = margin;

        // Helper function to add section
        const addSection = (title, content, isOptional = false) => {
            if (isOptional && !content.trim()) return;

            // Section title
            doc.setTextColor(colors.primary);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, currentY);
            currentY += 10;

            // Section content
            doc.setTextColor(colors.text);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            // Wrap text to fit the page
            const splitContent = doc.splitTextToSize(content, pageWidth - (2 * margin));
            doc.text(splitContent, margin, currentY);
            currentY += (splitContent.length * 7) + 5;
        };

        // Add header
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        // add leerlijn to this text
        let text = 'Ideefase';
        text = text + ' - ' + form.querySelector('input[name="project-type"]:checked')?.value || '';
        doc.text(text, margin, 15);

        // Reset for content
        currentY = 35;
        doc.setTextColor(colors.text);

        // Add project details
        addSection('Naam van de applicatie', form.elements['project-name'].value);
        addSection('Project omschrijving', form.elements['description'].value);
        addSection('Kern functionaliteiten', Array.from(document.querySelectorAll(".core-feature")).map(input => input.value).join("\n"));

        // Conditionally add optional sections
        if (form.elements['project-type'].value === "Backend" || form.elements['project-type'].value === "Fullstack") {
            addSection('Entiteiten', form.elements['entities'].value, true);
        }
        if (form.elements['project-type'].value === "Frontend") {
            addSection('Backend', form.elements['backend-type'].value, true);
        }
        if (form.elements['project-type'].value === "Frontend") {
            addSection('Gekozen REST API', form.elements['other-apis'].value, true);
        }
        // Save the PDF
        doc.save('project-ideation.pdf');
    });

    // Initialize preview
    updatePreview();
});