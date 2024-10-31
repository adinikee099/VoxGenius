document.addEventListener("DOMContentLoaded", () => {
  // Reconocimiento de voz
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "es-ES";
  recognition.interimResults = false;

  let currentUtterance = null;

  document.getElementById("voice-button").addEventListener("click", () => {
    recognition.start();
  });

  document.getElementById("cancel-button").addEventListener("click", () => {
    stopSpeaking();
  });

  // Nuevo botón para reiniciar el chat
  document.getElementById("new-text-button").addEventListener("click", () => {
    resetChat();
  });

  // Manejo de errores
  recognition.onerror = (event) => {
    console.error("Error en reconocimiento de voz: ", event.error);
    appendMessage(
      "assistant",
      "Hubo un problema al reconocer tu voz. Intenta de nuevo."
    );
  };

  recognition.onresult = (event) => {
    let voiceInput = event.results[0][0].transcript;
    voiceInput = voiceInput.replace(/,/g, ""); // Eliminar comas
    document.getElementById("user-input").value = voiceInput;
    processInput(voiceInput);
  };

  // Función para detener la voz
  function stopSpeaking() {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      currentUtterance = null; // Limpiar la referencia
    }
  }

  // Función para reiniciar el chat
  function resetChat() {
    document.getElementById("chat-box").innerHTML = ""; // Limpiar el chat
    document.getElementById("user-input").value = ""; // Limpiar el input
    stopSpeaking(); // Detener cualquier síntesis de voz en curso
  }

  // Responder en la caja de chat
  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
      sender === "user" ? "user-message" : "assistant-message"
    );
    messageElement.textContent = message;
    document.getElementById("chat-box").appendChild(messageElement);
    document.getElementById("chat-box").scrollTop = document.getElementById(
      "chat-box"
    ).scrollHeight;

    if (sender === "assistant") {
      currentUtterance = new SpeechSynthesisUtterance(message);
      currentUtterance.lang = "es-ES";
      currentUtterance.onend = () => {
        currentUtterance = null;
      }; // Limpiar al terminar
      window.speechSynthesis.speak(currentUtterance);
    }
  }

  // Función para buscar información en Wikipedia
  async function searchWikipedia(query) {
    const apiUrl = `https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
      query
    )}&utf8=1&srlimit=1`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.query.search.length > 0) {
      const title = data.query.search[0].title;
      const snippet = data.query.search[0].snippet.replace(/<[^>]*>/g, ""); // Eliminar etiquetas HTML
      return `Según Wikipedia, ${title}: ${snippet}`;
    } else {
      return "No encontré información sobre eso en Wikipedia.";
    }
  }

  // Procesar comandos
  async function processInput(input) {
    input = input.toLowerCase().replace(/,/g, ""); // Eliminar comas antes de procesar
    appendMessage("user", input);

    // Repetir frases
    if (input.startsWith("genius repite")) {
      const phraseToRepeat = input.replace("genius repite", "").trim();
      if (phraseToRepeat) {
        appendMessage("assistant", phraseToRepeat);
      } else {
        appendMessage("assistant", "No hay nada para repetir.");
      }

      // Comando de reproducción de música en YouTube
    } else if (input.startsWith("genius reproduce")) {
      const songRequest = input.replace("genius reproduce", "").trim();
      if (songRequest) {
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
          songRequest
        )}`;
        appendMessage("assistant", `Reproduciendo ${songRequest} en YouTube.`);
        window.open(youtubeUrl, "_blank");
      } else {
        appendMessage(
          "assistant",
          "No especificaste ninguna canción o artista."
        );
      }

      // Información de presidentes por país
    } else if (input.includes("presidente de argentina")) {
      appendMessage(
        "assistant",
        "El presidente de Argentina es Javier Milei, un economista y político conocido por sus opiniones liberales y críticas al sistema político tradicional."
      );
    } else if (input.includes("presidente de bolivia")) {
      appendMessage(
        "assistant",
        "El presidente de Bolivia es Luis Arce, miembro del partido MAS y exministro de economía, conocido por su enfoque en la economía y el crecimiento inclusivo."
      );
    } else if (input.includes("presidente de chile")) {
      appendMessage(
        "assistant",
        "El presidente de Chile es Gabriel Boric, un ex líder estudiantil y político progresista que ha defendido reformas sociales en su país."
      );
    } else if (input.includes("presidente de brasil")) {
      appendMessage(
        "assistant",
        "El presidente de Brasil es Luiz Inácio Lula da Silva, conocido como Lula, quien ha tenido un impacto significativo en la política brasileña y ha promovido políticas de inclusión social."
      );
    } else if (input.includes("presidente de colombia")) {
      appendMessage(
        "assistant",
        "El presidente de Colombia es Gustavo Petro, un exguerrillero y político que ha promovido reformas sociales y ambientales."
      );
    } else if (input.includes("presidente de ecuador")) {
      appendMessage(
        "assistant",
        "El presidente de Ecuador es Guillermo Lasso, un exbanquero y político conservador que ha impulsado políticas de apertura económica."
      );
    } else if (input.includes("presidente de china")) {
      appendMessage(
        "assistant",
        "El presidente de China es Xi Jinping, líder del Partido Comunista de China y conocido por sus políticas de expansión y desarrollo económico."
      );
    } else if (input.includes("presidente de japon")) {
      appendMessage(
        "assistant",
        "El primer ministro de Japón es Fumio Kishida, quien ha centrado su política en el crecimiento económico y la estabilidad de Japón en la región."
      );
    } else if (input.includes("presidente de estados unidos")) {
      appendMessage(
        "assistant",
        "El presidente de los Estados Unidos es Joe Biden, un político de larga trayectoria que ha promovido políticas de recuperación económica y justicia social."
      );
    } else if (input.includes("presidente de paraguay")) {
      appendMessage(
        "assistant",
        "El presidente de Paraguay es Santiago Peña, quien asume el cargo en agosto de 2023, prometiendo fomentar la inversión y el desarrollo económico en el país."
      );

      // Hora actual
    } else if (input.includes("qué hora es")) {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      const currentTime = new Date().toLocaleString("es-ES", options);
      appendMessage("assistant", `La hora actual es ${currentTime}.`);

      // Día actual
    } else if (input.includes("qué día es hoy")) {
      const currentDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      appendMessage("assistant", `Hoy es ${currentDate}.`);

      // Buscar información general en Wikipedia
    } else {
      const wikiResponse = await searchWikipedia(input);
      appendMessage("assistant", wikiResponse);
    }
  }

  // Manejo de botón de enviar
  document.getElementById("send-button").addEventListener("click", () => {
    const userInput = document
      .getElementById("user-input")
      .value.replace(/,/g, ""); // Eliminar comas al escribir también
    processInput(userInput);
    document.getElementById("user-input").value = "";
  });

  // Enviar con la tecla Enter
  document.getElementById("user-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const userInput = document
        .getElementById("user-input")
        .value.replace(/,/g, ""); // Eliminar comas al escribir también
      processInput(userInput);
      document.getElementById("user-input").value = "";
    }
  });
});
