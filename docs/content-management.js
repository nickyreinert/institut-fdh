// Helper function to check if a name already exists in content
function isNameUnique(name, content) {
  return !content.some(item => item.name === name);
}

// Modify generateRandomContent to check for level 10
function generateRandomContent() {
  const windowId = activeWindow;
  
  // Check if we're at level 10
  if (currentLevel[windowId] === 10) {
    return [{
      name: 'S3CR3T.TXT',
      isFolder: false
    }];
  }

  // Original content generation for other levels
  const numItems = Math.floor(Math.random() * 50) + 1;
  const content = [];
  let attempts = 0;
  const maxAttempts = 100;

  for (let i = 0; i < numItems && attempts < maxAttempts; i++) {
    const isFolder = i === 0 || Math.random() < 0.3;
    const newName = generateRandomName(isFolder);
    
    if (isNameUnique(newName, content)) {
      content.push({
        name: newName,
        isFolder: isFolder
      });
    } else {
      i--;
      attempts++;
    }
  }

  return content;
}

let currentLevel = {}; // Keep track of current level for each lane
let currentContent = {}; // Store current content for each window

// Function to calculate the maximum number of items that fit in a lane
function getMaxItemsInLane(laneElement) {
  if (!laneElement) {
    console.error('Lane element is null');
    return 10;
  }

  // Get the lane's total height
  const laneHeight = laneElement.clientHeight;
  if (!laneHeight) {
    console.error('Could not get lane height');
    return 10;
  }

  // Create a temporary file element to measure its height
  const tempFile = document.createElement('div');
  tempFile.classList.add('file');
  tempFile.style.visibility = 'hidden'; // Make it invisible
  tempFile.textContent = 'Test'; // Add some content to get proper height
  laneElement.appendChild(tempFile);
  
  // Get the actual height of a file element including margins
  const fileStyle = window.getComputedStyle(tempFile);
  const fileHeight = tempFile.offsetHeight + 
                     parseInt(fileStyle.marginTop) + 
                     parseInt(fileStyle.marginBottom);
  
  // Remove the temporary element
  laneElement.removeChild(tempFile);

  // Calculate max items, accounting for the lane header
  const headerHeight = laneElement.querySelector('.lane-header')?.offsetHeight || 0;
  const availableHeight = laneHeight - headerHeight;
  
  // Calculate how many items can fit, leaving a small buffer
  const buffer = 10; // pixels of buffer space
  return Math.floor((availableHeight - buffer) / fileHeight);
}

// Modify renderContent to always select first file in first lane after entering folder
function renderContent(laneElement, content) {
  const windowElement = laneElement?.closest('.window');
  const laneId = windowElement?.id;
  if (!laneId) {
    console.error('Could not find window ID for lane:', laneElement);
    return;
  }

  // Initialize currentLevel if not exists
  if (typeof currentLevel[laneId] === 'undefined') {
    currentLevel[laneId] = 0;
  }

  // Store the content for this window
  currentContent[laneId] = content;
  
  // Clear all lanes in this window first
  const allLanes = windowElement.querySelectorAll('.lane');
  allLanes.forEach((lane, index) => {
    const fileListName = lane.querySelector(`.file-list-${index + 1} .file-list-name`);
    const fileListExtension = lane.querySelector(`.file-list-${index + 1} .file-list-extension`);
    if (fileListName) fileListName.innerHTML = '';
    if (fileListExtension) fileListExtension.innerHTML = '';
  });

  // Create a Set to track all names in the current view
  const existingNames = new Set();
  
  // Get all existing file names from all lanes
  allLanes.forEach(lane => {
    const fileElements = lane.querySelectorAll('.file');
    fileElements.forEach(file => {
      existingNames.add(file.textContent);
    });
  });

  // Filter out any duplicate content before sorting
  content = content.filter(item => !existingNames.has(item.name));

  // Sort content: folders first, then files
  content.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  let currentLaneIndex = 0;
  let remainingContent = [...content];

  while (remainingContent.length > 0 && currentLaneIndex < allLanes.length) {
    const currentLane = allLanes[currentLaneIndex];
    const fileListName = currentLane.querySelector(`.file-list-${currentLaneIndex + 1} .file-list-name`);
    const fileListExtension = currentLane.querySelector(`.file-list-${currentLaneIndex + 1} .file-list-extension`);

    if (!fileListName || !fileListExtension) {
      console.error('Missing file list elements in lane:', currentLaneIndex);
      break;
    }

    // Calculate available space in current lane
    const maxItems = getMaxItemsInLane(currentLane);
    let contentForLane = remainingContent.slice(0, maxItems);
    
    // Add ".." for navigating back if we're not at the root level AND this is the first lane
    if (currentLevel[laneId] > 0 && currentLaneIndex === 0) {
      const backItem = {
        name: '..',
        isFolder: true
      };
      contentForLane = [backItem, ...contentForLane];
      // Adjust the remaining content slice if we added the back item
      contentForLane = contentForLane.slice(0, maxItems);
    }
    
    // Adjust the remaining content calculation
    if (currentLevel[laneId] > 0 && currentLaneIndex === 0) {
      // If we added "..", we need to account for it in the slice
      remainingContent = remainingContent.slice(contentForLane.length - 1);
    } else {
      remainingContent = remainingContent.slice(contentForLane.length);
    }

    // Render items in current lane
    contentForLane.forEach(item => {
      const fileElementName = document.createElement('div');
      fileElementName.classList.add('file');
      fileElementName.textContent = item.name;
      
      // Special handling for ".." navigation
      if (item.name === '..') {
        fileElementName.addEventListener('click', () => {
          // Only update selection on single click, don't show details
          selectFile(fileElementName);
        });
        fileElementName.addEventListener('dblclick', () => {
          currentLevel[laneId]--;
          const newContent = generateRandomContent();
          renderContent(laneElement, newContent);
          resetFileDetails();
        });
      } else {
        fileElementName.addEventListener('click', (event) => {
          selectFile(fileElementName);
          handleFileClick(item, laneId, currentLane, event);
        });
      }
      
      fileListName.appendChild(fileElementName);

      // Only add extension element for regular files (not for ".." or folders)
      if (item.extension && item.name !== '..') {
        const fileElementExtension = document.createElement('div');
        fileElementExtension.classList.add('file');
        fileElementExtension.textContent = item.extension;
        fileElementExtension.addEventListener('click', (event) => {
          selectFile(fileElementName);
          handleFileClick(item, laneId, currentLane, event);
        });
        fileListExtension.appendChild(fileElementExtension);
      }
    });

    currentLaneIndex++;
  }

  // After rendering is complete, always select first file in first lane
  const firstFile = laneElement.querySelector('.file');
  if (firstFile) {
    selectFile(firstFile);
  }
} 