const topics = {
  data_structures: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs"],
  algorithms: ["Dynamic Programming", "Recursion", "Backtracking", "Sorting", "Searching", "Greedy"],
};

function cleanAIResponse(response) {
  let cleanedResponse = response
    .replace(/\*+/g, "") // Remove asterisks
    .replace(/#+/g, "") // Remove hash symbols
    .replace(/---+/g, "") // Remove separator lines
    .replace(/\n\s*\n/g, "\n") // Remove multiple blank lines
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading/trailing whitespace

  // Debugging step: log intermediate result
  console.log("After Basic Cleaning:", cleanedResponse);

  // Ensure formatting with proper line breaks
  cleanedResponse = cleanedResponse
    .replace(/(Title:)/g, "\n$1") // Newline before "Title:"
    .replace(/(Input Format:)/g, "\n\n$1") // Double newline before "Input Format:"
    .replace(/(Output Format:)/g, "\n\n$1") // Double newline before "Output Format:"
    .replace(/(Example:)/g, "\n\n$1"); // Double newline before "Example:"

  // Debugging step: log final output
  console.log("Final Cleaned Response:", cleanedResponse);

  return cleanedResponse;
}


function loadTopics() {
  const category = document.getElementById("category").value;
  const topicSelect = document.getElementById("topics");
  const topicSection = document.getElementById("topicSection");
  const difficultySection = document.getElementById("difficultySection");
  const generateBtn = document.getElementById("generateBtn");

  topicSelect.innerHTML = "";
  if (category) {
    topicSection.classList.remove("hidden");
    topics[category].forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      topicSelect.appendChild(option);
    });
  } else {
    topicSection.classList.add("hidden");
    difficultySection.classList.add("hidden");
    generateBtn.classList.add("hidden");
  }
}

function showDifficulty() {
  document.getElementById("difficultySection").classList.remove("hidden");
  document.getElementById("generateBtn").classList.remove("hidden");
}

async function generateQuestion() {
  const topic = document.getElementById("topics").value;
  const difficulty = document.getElementById("difficulty").value;
  if (!topic) return;

  const response = await fetchAI(`Generate a ${difficulty} level problem based on ${topic}`);
  
  document.getElementById("questionText").textContent = cleanAIResponse(response);
  document.getElementById("questionSection").classList.remove("hidden");
  document.getElementById("solutionInput").classList.remove("hidden");
  document.getElementById("submitBtn").classList.remove("hidden");
}

async function submitSolution() {
  const solution = document.getElementById("solutionInput").value;
  if (!solution) return;

  const feedback = await fetchAI(
    `Analyze this solution for time and space complexity, suggest improvements: ${solution}`
  );
  const grade = await fetchAI(
    `Grade this solution from 1 to 5 based on best practices and testability: ${solution}`
  );
  

  document.getElementById("feedbackText").textContent = cleanAIResponse(feedback);
  document.getElementById("gradeText").textContent = `Grade: ${cleanAIResponse(grade)}`;
  document.getElementById("feedbackSection").classList.remove("hidden");
}

async function fetchAI(prompt) {
  const apiKey = "";

  try {
    const response = await fetch(
      `https://ai-proxy.lab.epam.com/openai/deployments/gpt-4/chat/completions?api-version=2023-08-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": `${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          temperature: 0,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error(`Error with model:`, error);
  }

  return "AI response could not be generated.";
}



