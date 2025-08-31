
let wasteData = [];
let model;

// Load dataset
fetch("waste-data.json")
  .then(res => res.json())
  .then(data => wasteData = data);

// Load TensorFlow model
async function loadModel() {
  model = await mobilenet.load();
  console.log("TensorFlow.js MobileNet model loaded");
}
loadModel();

// Search handler
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  searchWaste(query);
}

// Search function
function searchWaste(query) {
  const resultDiv = document.getElementById("result");
  if (!query) {
    resultDiv.innerHTML = "Please enter a waste item.";
    return;
  }
  const match = wasteData.find(item => item.name.toLowerCase().includes(query));
  if (match) {
    resultDiv.innerHTML = `<strong>${match.name}</strong><br>Category: ${match.category}<br>Disposal: ${match.disposal}`;
  } else {
    resultDiv.innerHTML = "❌ Item not found in database.";
  }
}

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    identifyWasteImage(file);
  }
}

// Identify waste using TensorFlow.js
async function identifyWasteImage(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.width = 224;
  img.height = 224;
  img.onload = async () => {
    const predictions = await model.classify(img);
    console.log("Predictions:", predictions);
    if (predictions.length > 0) {
      const itemName = predictions[0].className.toLowerCase();
      searchWaste(itemName);
    }
  };
}
