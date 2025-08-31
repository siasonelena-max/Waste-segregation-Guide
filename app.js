let model;
let currentImage = null;

// Load AI model
async function loadModel() {
  model = await mobilenet.load();
  console.log("✅ AI Model loaded");
}
loadModel();

// Waste dataset (expand as needed)
const wasteData = {
  "plastic bottle": { type: "Recyclable", guide: "Dispose in recycling bin." },
  "banana": { type: "Biodegradable", guide: "Put in compost bin." },
  "paper": { type: "Recyclable", guide: "Recycle with paper waste." },
  "syringe": { type: "Hazardous", guide: "Dispose in sharps container." }
};

// Search function
function searchWaste() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");
  if (wasteData[input]) {
    resultDiv.innerHTML = `✅ <b>${input}</b> → ${wasteData[input].type}<br>📌 ${wasteData[input].guide}`;
  } else {
    resultDiv.innerHTML = "❌ Waste not found in database.";
  }
}

// Preview uploaded image
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImage = e.target.result;
      document.getElementById("previewImg").src = currentImage;
      document.getElementById("imagePreview").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

// Classify image with AI
async function classifyImage() {
  if (!model || !currentImage) return alert("Upload an image first!");

  const imgElement = document.getElementById("previewImg");
  const predictions = await model.classify(imgElement);
  console.log(predictions);

  const bestGuess = predictions[0].className.toLowerCase();
  const resultDiv = document.getElementById("result");

  if (wasteData[bestGuess]) {
    resultDiv.innerHTML = `🤖 AI thinks this is: <b>${bestGuess}</b><br>
      ✅ Type: ${wasteData[bestGuess].type}<br>
      📌 Guide: ${wasteData[bestGuess].guide}`;
  } else {
    resultDiv.innerHTML = `🤖 AI detected: <b>${bestGuess}</b><br>
      ❌ Not found in waste database.`;
  }
}

// Edit (choose new image)
function editImage() {
  document.getElementById("imageUpload").click();
}

// Delete (remove image)
function deleteImage() {
  currentImage = null;
  document.getElementById("imagePreview").classList.add("hidden");
  document.getElementById("previewImg").src = "";
  document.getElementById("result").innerHTML = "";
}
