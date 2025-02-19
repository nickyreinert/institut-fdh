// Function to generate random file/folder names
// Function to generate random file/folder names (DOS style)
function generateRandomName(isFolder = false) {
  const dosFolderNames = [
    'DOS', 'COMMAND', 'CONFIG', 'SYSTEM', 'GAMES', 'UTIL', 'MOUSE', 'DRIVER',
    'FONT', 'AUTOEXEC', 'WINDOWS', 'TEMP', 'TMP', 'USER', 'BIN', 'INCLUDE',
    'LIB', 'SRC', 'DOC', 'PROJECT', 'DATA', 'BACKUP', 'ARCHIVE', 'NETWORK',
    'PROGRAM', 'TOOLS', 'BASIC', 'PASCAL', 'CPP', 'ASM', 'DEBUG', 'EDIT',
    'HELP', 'PRINT', 'BATCH', 'APPS', 'WORD', 'EXCEL', 'LOTUS', 'DBASE',
    'NORTON', 'PCTOOLS', 'QBASIC', 'BORLAND', 'TURBO', 'MSCDEX', 'DRIVERS',
    'IMAGES', 'TEXT', 'MAIL', 'MODEM', 'COM', 'GAME', 'SIERRA', 'LUCASART'
  ];

  const dosFileNames = [
    'COMMAND', 'CONFIG', 'SYSTEM', 'HIMEM', 'EMM386', 'SMARTDRV', 'MSCDEX',
    'ANSI', 'COUNTRY', 'DISPLAY', 'KEYBOARD', 'PRINTER', 'MOUSE', 'SOUND',
    'GAME', 'UTIL', 'README', 'INSTALL', 'SETUP', 'DEMO', 'SHARE', 'REPORT',
    'LETTER', 'DOCUMENT', 'DATA', 'BACKUP', 'ARCHIVE', 'AUTOEXEC', 'FORMAT',
    'CHKDSK', 'DEFRAG', 'SCANDISK', 'UNDELETE', 'UNFORMAT', 'EDIT', 'DEBUG',
    'QBASIC', 'BASIC', 'PASCAL', 'MASM', 'TASM', 'LINK', 'MAKE', 'BUILD',
    'DOOM', 'WOLF3D', 'PRINCE', 'MONKEY', 'LEMMINGS', 'TETRIS', 'PACMAN',
    'LOTUS', 'DBASE', 'WORDPERF', 'NOTEPAD', 'CALC', 'CALENDAR', 'TERMINAL',
    'TELNET', 'FTP', 'PING', 'IPCONFIG', 'NETSTAT', 'EDIT', 'HELP', 'DIR'
  ];

  const dosExtensions = isFolder ? [''] : [
    '.COM', '.EXE', '.BAT', '.SYS', '.TXT', '.INI', '.CFG', '.LOG',
    '.DAT', '.DBF', '.IDX', '.BAK', '.OLD', '.TMP', '.DOC', '.WK1',
    '.WK3', '.XLS', '.DBF', '.MDB', '.BAS', '.PAS', '.C', '.CPP', 
    '.ASM', '.OBJ', '.LIB', '.DLL', '.DRV', '.386', '.VXD', '.FON',
    '.BMP', '.PCX', '.GIF', '.ZIP', '.ARJ', '.PAK', '.SAV', '.WRI'
  ];

  const names = isFolder ? dosFolderNames : dosFileNames;
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomExtension = dosExtensions[Math.floor(Math.random() * dosExtensions.length)];

  // 8.3 filename format (truncate if necessary)
  return `${randomName.slice(0, 8)}${randomExtension}`; 
}

// Helper function to check if a name already exists in content
function isNameUnique(name, content) {
  return !content.some(item => item.name === name);
}

// Modify generateRandomContent to ensure unique names
function generateRandomContent() {
  const numItems = Math.floor(Math.random() * 50) + 1; // 1 to 50 items
  const content = [];
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  for (let i = 0; i < numItems && attempts < maxAttempts; i++) {
    const isFolder = i === 0 || Math.random() < 0.3;
    const newName = generateRandomName(isFolder);
    
    // Only add if the name is unique
    if (isNameUnique(newName, content)) {
      content.push({
        name: newName,
        isFolder: isFolder
      });
    } else {
      // Try again for this index
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

// Modify renderContent to ensure unique items across lanes
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
          currentLevel[laneId]--;
          const newContent = generateRandomContent();
          renderContent(laneElement, newContent);
          resetFileDetails();
        });
      } else {
        fileElementName.addEventListener('click', (event) => {
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
          handleFileClick(item, laneId, currentLane, event);
        });
        fileListExtension.appendChild(fileElementExtension);
      }
    });

    currentLaneIndex++;
  }
}

function handleFileClick(item, laneId, laneElement, event) {
  if (item.isFolder) {
    currentLevel[laneId]++;
    const newContent = generateRandomContent();
    renderContent(laneElement, newContent);
    resetFileDetails();
  } else {
    showFileDetails(item.name, event);
  }
}
// Function to display file details
function resetFileDetails() {
  const fileDetailsDiv = document.getElementById('window1').querySelector('.file-details');

  fileDetailsDiv.innerHTML = `
  <div class="detail-column">Name:</div> 
  <div class="detail-column">Date:</div>
  <div class="detail-column">Time:</div>
  <div class="detail-column">Size:</div>
`;

}
function showFileDetails(fileName, event) {
    // Add check for currentlyDisplayedFile before using it
    if (!currentlyDisplayedFile) {
        currentlyDisplayedFile = '';
    }
    
    if (fileName === currentlyDisplayedFile) {
        return;
    }
    
    // Update currentlyDisplayedFile after displaying details
    currentlyDisplayedFile = fileName;
    
    const clickedElement = event.target; 

    let windowElement = clickedElement.closest('.window');

    const fileDetailsDiv = windowElement.querySelector('.file-details');

    // DOS era date range (approximately)
    const dosStartDate = new Date('1981-08-12T00:00:00'); // IBM PC release date
    const dosEndDate = new Date('1995-12-31T23:59:59'); 

    // Generate random date within DOS era
    const randomDosTimestamp =  +(dosStartDate) + Math.random() * (+(dosEndDate) - +(dosStartDate));
    const randomDate = new Date(randomDosTimestamp).toLocaleDateString();
    const randomTime = new Date(randomDosTimestamp).toLocaleTimeString();

    const randomSize = Math.floor(Math.random() * 10000) + ' KB'; 

    fileDetailsDiv.innerHTML = `
      <div class="detail-column">Name: ${fileName}</div> 
      <div class="detail-column">Date: ${randomDate}</div>
      <div class="detail-column">Time: ${randomTime}</div>
      <div class="detail-column">Size: ${randomSize}</div>
    `;
}

let currentlyDisplayedFile = null; 

// Add debounced window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  // Clear the timeout if it exists
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  // Set a new timeout to prevent excessive re-renders
  resizeTimeout = setTimeout(() => {
    // Re-render all windows with their current content
    Object.keys(currentContent).forEach(windowId => {
      const windowElement = document.getElementById(windowId);
      if (windowElement) {
        const firstLane = windowElement.querySelector('.lane');
        if (firstLane) {
          renderContent(firstLane, currentContent[windowId]);
        }
      }
    });
  }, 250); // Wait 250ms after last resize event before re-rendering
});

// Add this code right before the window.onload function

function showWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  modal.style.display = 'block';

  // Add click handler for the OK button
  const okButton = modal.querySelector('.button');
  okButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Also close on Enter key
  document.addEventListener('keydown', function handleEnter(e) {
    if (e.key === 'Enter' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEnter);
    }
  });
}

// Add these functions after the showWelcomeModal function

function generateGibberish() {
  const errors = [
    {
      title: "FEHLER 0xC000-0047",
      content: [
        "Segmentierungsfehler in Speicheradresse 0x74A2:FF01",
        "Ungültiger Speicherzugriff in Modul COMMAND.COM",
        "System hält an...",
        "",
        "Drücken Sie eine beliebige Taste um fortzufahren"
      ]
    },
    {
      title: "SYSTEM-FEHLER",
      content: [
        "Kritischer Fehler 27 in Drive C:",
        "Abort, Retry, Fail?",
        "",
        "HIMEM.SYS nicht gefunden",
        "Erweiterter Speicher nicht verfügbar"
      ]
    },
    {
      title: "FATAL ERROR",
      content: [
        "Unerwarteter Fehler in SYSTEM.DRV",
        "Stack Overflow in 0xFF12",
        "Programm terminiert",
        "",
        "ERR: Division durch Null in Zeile 4012"
      ]
    },
    {
      title: "SCHWERWIEGENDER AUSNAHMEFEHLER",
      content: [
        "Interrupt 13h fehlgeschlagen",
        "Festplattenfehler - Sektor nicht lesbar",
        "Fehlercode: 0xDEAD",
        "",
        "Neustart erforderlich"
      ]
    }
  ];

  return errors[Math.floor(Math.random() * errors.length)];
}

function showErrorModal(error) {
  // Create modal elements
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal';
  modalDiv.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  modalHeader.textContent = error.title;

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.innerHTML = error.content.join('<br>');

  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';

  const okButton = document.createElement('div');
  okButton.className = 'button';
  okButton.innerHTML = 'OK';

  // Add click handler to close modal
  okButton.addEventListener('click', () => {
    document.body.removeChild(modalDiv);
  });

  // Add keyboard handler
  function handleKeyPress(e) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      document.body.removeChild(modalDiv);
      document.removeEventListener('keydown', handleKeyPress);
    }
  }
  document.addEventListener('keydown', handleKeyPress);

  // Assemble modal
  modalFooter.appendChild(okButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDiv.appendChild(modalContent);

  // Add to document
  document.body.appendChild(modalDiv);
}

// Modify the window.onload function to show the modal
window.onload = function() {
  // Show welcome modal
  showWelcomeModal();

  // Add handlers for menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      showErrorModal(generateGibberish());
    });
  });

  // Add handlers for bottom buttons
  document.querySelectorAll('.button-bar .button').forEach(button => {
    button.addEventListener('click', () => {
      showErrorModal(generateGibberish());
    });
  });

  // Existing window.onload code...
  const windows = document.querySelectorAll('.window');
  windows.forEach(windowElement => {
    const windowLanes = windowElement.querySelectorAll('.lane');
    const initialContent = generateRandomContent();
    currentContent[windowElement.id] = initialContent;
    const firstLane = windowLanes[0];
    if (firstLane) {
      renderContent(firstLane, initialContent);
    }
  });
};


