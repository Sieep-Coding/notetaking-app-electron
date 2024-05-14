const fs = require('fs');
const path = require('path');

const remindersFilePath = path.join(__dirname, 'reminders.json');

let reminders = [];

// Load existing reminders from the file
function loadReminders() {
  try {
    const data = fs.readFileSync(remindersFilePath, 'utf8');
    reminders = JSON.parse(data);
    renderReminders();
  } catch (err) {
    // If the file doesn't exist, create it
    fs.writeFileSync(remindersFilePath, JSON.stringify([]));
  }
}

// Save reminders to the file
function saveReminders() {
  fs.writeFileSync(remindersFilePath, JSON.stringify(reminders));
}

// Render reminders in the reminder list
function renderReminders() {
    const noteList = document.querySelector('.reminder-list ul');
    noteList.innerHTML = '';
  
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = note.title || `Note ${index + 1}`;
      input.addEventListener('change', () => {
        notes[index].title = input.value.trim() || `Note ${index + 1}`;
        saveReminders();
      });
  
      li.appendChild(input);
      li.addEventListener('click', () => displayNote(index)); // Add click event listener
      noteList.appendChild(li);
    });
  }

// Display a reminder in the editor
function displayReminder(index) {
  const titleInput = document.querySelector('.reminder-editor input[type="text"]');
  const descriptionTextarea = document.querySelector('.reminder-editor textarea');

  titleInput.value = reminders[index].title || '';
  descriptionTextarea.value = reminders[index].description || '';

  currentReminderIndex = index;
}

// Save the current reminder
function saveCurrentReminder() {
  const titleInput = document.querySelector('.reminder-editor input[type="text"]');
  const descriptionTextarea = document.querySelector('.reminder-editor textarea');
  const reminderTimeSelect = document.getElementById('reminder-time');

  const reminderTitle = titleInput.value.trim();
  const reminderDescription = descriptionTextarea.value.trim();
  const reminderTime = parseInt(reminderTimeSelect.value); // Parse reminder time to integer

  // Create a new reminder
  if (currentReminderIndex === null) {
    reminders.push({
      title: reminderTitle,
      description: reminderDescription,
      time: reminderTime // Store reminder time
    });
  } else {
    // Update an existing reminder
    reminders[currentReminderIndex] = {
      title: reminderTitle,
      description: reminderDescription,
      time: reminderTime
    };
  }

  saveReminders();
  renderReminders();
  clearEditor();

  // Schedule notification
  scheduleNotification(reminderTitle, reminderDescription, reminderTime);
}

// Create a new reminder
function createNewReminder() {
  currentReminderIndex = null;
  clearEditor();
}

// Delete the current reminder
function deleteCurrentReminder() {
  if (currentReminderIndex !== null) {
    reminders.splice(currentReminderIndex, 1);
    saveReminders();
    renderReminders();
    clearEditor();
  }
}

// Clear the reminder editor
function clearEditor() {
  const titleInput = document.querySelector('.reminder-editor input[type="text"]');
  const descriptionTextarea = document.querySelector('.reminder-editor textarea');

  titleInput.value = '';
  descriptionTextarea.value = '';
}

// Schedule notification
function scheduleNotification(title, description, time) {
  // Calculate time in milliseconds
  const timeInMilliseconds = time * 60 * 1000;

  // Use setTimeout to trigger the notification after the specified time
  setTimeout(() => {
    // Send notification
    console.log(`Reminder: ${title} - ${description}`);
  }, timeInMilliseconds);
}

// Event listeners
document.querySelector('.save-btn').addEventListener('click', saveCurrentReminder);
document.querySelector('.new-btn').addEventListener('click', createNewReminder);
document.querySelector('.delete-btn').addEventListener('click', deleteCurrentReminder);

// Initialize
let currentReminderIndex = null;
loadReminders();
loadSettings(); // Apply settings from settings.js