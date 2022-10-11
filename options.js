let colorPicker = document.getElementById("color");

chrome.storage.sync.get("color", (data) => {
  colorPicker.value = data.color
});


colorPicker.addEventListener('input', function(e) {   //TODO: Max operations per minute
  let color = colorPicker.value
  chrome.storage.sync.set({ color });
})




