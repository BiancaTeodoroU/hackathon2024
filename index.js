class FormColorManager {
    constructor(formElement, contentTables) {
        this.formElement = formElement;
        this.contentTables = contentTables;
    }

    updateFormAndTableStyle() {
        let selectedColor = '';

        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            if (checkbox.checked && checkbox.dataset.color) {
                selectedColor = checkbox.dataset.color;
            }
        });

        if (selectedColor) {
            this.formElement.style.backgroundColor = selectedColor;
            this.contentTables.forEach(table => {
                table.style.backgroundColor = selectedColor;
            });
        } else {
            this.formElement.style.backgroundColor = '';
            this.contentTables.forEach(table => {
                table.style.backgroundColor = '';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-record-btn');

    startButton.addEventListener('click', startRecognition);

    function startRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";

        recognition.onstart = function() {
            console.log("Reconhecimento de voz iniciado. Fale algo...");
        };

        recognition.onresult = function(event) {
            let transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log("Texto reconhecido:", transcript);
            processSpeech(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Erro no reconhecimento de fala:', event.error);
        };

        recognition.onend = function() {
            console.log('Reconhecimento de fala encerrado.');
        };

        recognition.start();
    }

    function processSpeech(speech) {
        // Normaliza a fala para facilitar a correspondência
        const normalizedSpeech = speech.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        // Mapear as palavras para os valores dos checkboxes
        const symptomMapping = {
            "cefaleia": "cefaleia",
            "diarreia": "diarreia",
            "tosse": "tosse",
            "febre": "febre",
            "dor abdominal intensa": "dor abdominal intensa",
        };

        // Verifica se a fala corresponde a algum dos valores dos checkboxes
        for (const [key, value] of Object.entries(symptomMapping)) {
            if (normalizedSpeech.includes(key)) {
                checkCheckbox(value);
            }
        }
    }

    function checkCheckbox(value) {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
        checkboxes.forEach(checkbox => {
            if (checkbox.value.toLowerCase() === value.toLowerCase()) {
                checkbox.checked = true;
                updateCheckboxStyle(checkbox);
                console.log(`Checkbox marcado: ${value}`);
            }
        });
        formColorManager.updateFormAndTableStyle();
    }

    // Adiciona evento para verificar o conteúdo sempre que um checkbox é alterado
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => updateCheckboxStyle(checkbox));
    });

    function updateCheckboxStyle(checkbox) {
        if (checkbox.checked) {
            if (checkbox.classList.contains('common-symptom')) {
                checkbox.parentElement.classList.add('common-symptom-selected');
            } else if (checkbox.classList.contains('severe-symptom')) {
                checkbox.parentElement.classList.add('severe-symptom-selected');
            }
        } else {
            checkbox.parentElement.classList.remove('common-symptom-selected', 'severe-symptom-selected');
        }
    }
});
