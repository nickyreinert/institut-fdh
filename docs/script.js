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

// Add this function to get system information
function getSystemInfo() {
  const info = [
    "SYSTEM INFORMATION",
    "==================",
    "",
    `User Agent: ${navigator.userAgent}`,
    `Platform: ${navigator.platform}`,
    `Language: ${navigator.language}`,
    `Screen Resolution: ${window.screen.width}x${window.screen.height}`,
    `Color Depth: ${window.screen.colorDepth} bits`,
    `Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    `Current URL: ${window.location.href}`,
    `Cookies Enabled: ${navigator.cookieEnabled}`,
    `Online Status: ${navigator.onLine ? 'Connected' : 'Offline'}`,
    `Browser Vendor: ${navigator.vendor || 'Unknown'}`,
    `Memory: ${performance?.memory?.totalJSHeapSize ? Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB' : 'Unknown'}`,
    "",
    "CONNECTION INFO",
    "===============",
    "",
    `Connection Type: ${navigator.connection ? navigator.connection.effectiveType : 'Unknown'}`,
    `Downlink: ${navigator.connection ? navigator.connection.downlink + ' Mbps' : 'Unknown'}`,
    "",
    "HARDWARE INFO",
    "=============",
    "",
    `Logical Processors: ${navigator.hardwareConcurrency || 'Unknown'}`,
    `Device Memory: ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown'}`,
    `Max Touch Points: ${navigator.maxTouchPoints}`,
  ].join('\n');

  return info;
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

// Add these variables at the top with other globals
let activeWindow = 'window1'; // Track which window is active
let selectedFile = null; // Track selected file element

// Add this function to handle keyboard navigation
function handleKeyboardNavigation(e) {
  // Don't handle keyboard navigation if input field is focused
  if (document.activeElement.tagName === 'INPUT') {
    return;
  }

  if (e.key.startsWith('Arrow') || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Backspace') {
    e.preventDefault();
    e.stopPropagation();
    
    const windowElement = document.getElementById(activeWindow);
    if (!windowElement) return;
    
    // Handle Backspace for folder navigation
    if (e.key === 'Backspace') {
      const windowId = windowElement.id;
      if (currentLevel[windowId] > 0) {
        currentLevel[windowId]--;
        const firstLane = windowElement.querySelector('.lane');
        const newContent = generateRandomContent();
        renderContent(firstLane, newContent);
        resetFileDetails();
      }
      return;
    }
    
    if (!selectedFile) {
      const firstFile = windowElement.querySelector('.file');
      if (firstFile) {
        selectFile(firstFile);
        return;
      }
      return;
    }
    
    const currentLane = selectedFile.closest('.lane');
    if (!currentLane) return;
    
    const lanes = Array.from(windowElement.querySelectorAll('.lane'));
    const currentLaneIndex = lanes.indexOf(currentLane);
    
    // Get current position in lane
    const currentFiles = Array.from(currentLane.querySelectorAll('.file'));
    const currentPosition = currentFiles.indexOf(selectedFile);
    
    switch(e.key) {
      case 'ArrowLeft':
        if (currentLaneIndex > 0) {
          const prevLane = lanes[currentLaneIndex - 1];
          const prevFiles = Array.from(prevLane.querySelectorAll('.file'));
          // Select same position or last file if new lane is shorter
          const targetIndex = Math.min(currentPosition, prevFiles.length - 1);
          if (targetIndex >= 0) {
            selectFile(prevFiles[targetIndex]);
          }
        }
        break;
        
      case 'ArrowRight':
        if (currentLaneIndex < lanes.length - 1) {
          const nextLane = lanes[currentLaneIndex + 1];
          const nextFiles = Array.from(nextLane.querySelectorAll('.file'));
          // Select same position or last file if new lane is shorter
          const targetIndex = Math.min(currentPosition, nextFiles.length - 1);
          if (targetIndex >= 0) {
            selectFile(nextFiles[targetIndex]);
          }
        }
        break;
        
      case 'ArrowUp':
        if (selectedFile) {
          const files = Array.from(currentLane.querySelectorAll('.file'));
          const currentIndex = files.indexOf(selectedFile);
          if (currentIndex > 0) {
            selectFile(files[currentIndex - 1]);
          }
        }
        break;
        
      case 'ArrowDown':
        if (selectedFile) {
          const files = Array.from(currentLane.querySelectorAll('.file'));
          const currentIndex = files.indexOf(selectedFile);
          if (currentIndex < files.length - 1) {
            selectFile(files[currentIndex + 1]);
          }
        }
        break;
        
      case 'Tab':
        // Toggle between windows
        if (activeWindow === 'window1') {
          activeWindow = 'window2';
          const rightFiles = document.getElementById('window2').querySelectorAll('.file');
          if (rightFiles.length > 0) {
            selectFile(rightFiles[0]);
          }
        } else {
          activeWindow = 'window1';
          const leftFiles = document.getElementById('window1').querySelectorAll('.file');
          if (leftFiles.length > 0) {
            selectFile(leftFiles[0]);
          }
        }
        break;
        
      case 'Enter':
        if (selectedFile) {
          const fileName = selectedFile.textContent;
          const isFolder = !fileName.includes('.');
          const laneElement = selectedFile.closest('.lane');
          const windowId = selectedFile.closest('.window').id;
          
          // Special handling for S3CR3T.TXT
          if (fileName === 'S3CR3T.TXT') {
            showSystemInfoModal();
            return;
          }
          
          // Special handling for ".." navigation
          if (fileName === '..') {
            currentLevel[windowId]--;
            const newContent = generateRandomContent();
            renderContent(laneElement, newContent);
            resetFileDetails();
          } else if (isFolder) {
            currentLevel[windowId]++;
            const newContent = generateRandomContent();
            renderContent(laneElement, newContent);
            resetFileDetails();
          } else if (archiveExtensions.some(ext => fileName.toUpperCase().endsWith(ext))) {
            showArchiveExtraction(fileName);
          } else if (['.EXE', '.COM', '.BAT'].some(ext => fileName.toUpperCase().endsWith(ext))) {
            beep();
            const modal = document.getElementById('game-modal');
            modal.querySelector('.modal-header').textContent = fileName;
            modal.style.display = 'block';
            initGame();
          } else if (imageExtensions.some(ext => fileName.toUpperCase().endsWith(ext))) {
            showImageViewer(fileName);
          }
        }
        break;
    }
  }
}

// Function to select a file and show its details
function selectFile(fileElement) {
  // Remove previous selection
  if (selectedFile) {
    selectedFile.classList.remove('selected');
  }
  
  // Add selection to new file
  selectedFile = fileElement;
  fileElement.classList.add('selected');
  
  // Show file details
  const item = {
    name: fileElement.textContent,
    isFolder: !fileElement.textContent.includes('.')
  };
  showFileDetails(item.name, { target: fileElement });
  
  // Ensure the selected file is visible
  fileElement.scrollIntoView({ block: 'nearest' });
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

// Add these new functions for the Snake game
let gameInterval;
let snake;
let food;
let direction;
let score;
let gameCanvas;
let gameCtx;

function initGame() {
  gameCanvas = document.getElementById('snake-game');
  gameCtx = gameCanvas.getContext('2d');
  
  snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
  ];
  
  direction = 'right';
  score = 0;
  food = generateFood();
  
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  
  gameInterval = setInterval(gameLoop, 100);
  
  document.addEventListener('keydown', handleGameInput);
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * 28) + 1,
    y: Math.floor(Math.random() * 28) + 1
  };
}

function gameLoop() {
  const head = {x: snake[0].x, y: snake[0].y};
  
  switch(direction) {
    case 'right': head.x++; break;
    case 'left': head.x--; break;
    case 'up': head.y--; break;
    case 'down': head.y++; break;
  }
  
  if (head.x < 0 || head.x > 29 || head.y < 0 || head.y > 29 ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }
  
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score += 10;
  } else {
    snake.pop();
  }
  
  drawGame();
}

function drawGame() {
  gameCtx.fillStyle = '#000000';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw snake
  gameCtx.fillStyle = '#50FFFF';
  snake.forEach(segment => {
    gameCtx.fillRect(segment.x * 10, segment.y * 10, 9, 9);
  });
  
  // Draw food
  gameCtx.fillStyle = '#FFFF50';
  gameCtx.fillRect(food.x * 10, food.y * 10, 9, 9);
  
  // Draw score
  gameCtx.fillStyle = '#50FFFF';
  gameCtx.font = '20px Courier';
  gameCtx.fillText(`Score: ${score}`, 10, 30);
}

function handleGameInput(e) {
  // Prevent default behavior and stop propagation for game keys
  if (e.key.startsWith('Arrow') || e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Only process input if game is active
  if (!gameInterval) return;
  
  switch(e.key) {
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'Escape':
      endGame();
      break;
  }
}

function endGame() {
  if (!gameInterval) return; // Don't end if game is not running
  
  clearInterval(gameInterval);
  gameInterval = null; // Clear the interval reference
  const modal = document.getElementById('game-modal');
  modal.style.display = 'none';
}

// Add this list of image extensions near the top with other constants
const imageExtensions = ['.BMP', '.PCX', '.GIF', '.PNG', '.JPG'];
let lastClickTime = 0; // Add this line to fix the reference error

// Add archive extensions to the top with other constants
const archiveExtensions = ['.ARJ', '.ZIP', '.RAR'];

// Add this function to generate increasingly long filenames
function generateLongFilename(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  const extensions = ['.DOC', '.EXE', '.COM', '.BAT', '.TXT', '.DAT'];
  let name = '';
  for (let i = 0; i < length; i++) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name + extensions[Math.floor(Math.random() * extensions.length)];
}

// Add this function to show the archive extraction modal
function showArchiveExtraction(fileName) {
  beep();
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content archive-modal-content">
      <div class="modal-header">
        Extracting ${fileName}
      </div>
      <div class="modal-body archive-body">
        <div class="file-scroll-container"></div>
      </div>
      <div class="modal-footer">
        <div class="progress-text">Time remaining: --:--</div>
        <div class="button">Press ESC to cancel</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Calculate max lines based on container height
  const container = modal.querySelector('.file-scroll-container');
  const modalBody = modal.querySelector('.archive-body');
  const lineHeight = parseInt(getComputedStyle(container).lineHeight);
  const containerHeight = modalBody.clientHeight;
  const maxLines = Math.floor(containerHeight / lineHeight) - 1;

  const progressText = modal.querySelector('.progress-text');
  let fileLength = 8;
  let timeRemaining = 120;
  let scrollInterval;
  let timerInterval;
  let lineCount = 0;
  let cancelAttempts = 0;
  let scrollSpeed = 500;

  function updateTimer() {
    if (cancelAttempts > 0) {
      progressText.textContent = `WARNING: Unsafe cancellation attempt #${cancelAttempts}.`;
      return;
    }
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    progressText.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    timeRemaining--;

    if (timeRemaining < 0) {
      clearInterval(timerInterval);
      progressText.textContent = 'Extraction in progress...';
    }
  }

  function addNewFile() {
    const newFile = generateLongFilename(fileLength);
    const div = document.createElement('div');
    div.textContent = newFile;
    div.style.position = 'relative';
    container.appendChild(div);
    lineCount++;

    if (lineCount > maxLines) {
      container.removeChild(container.firstChild);
      lineCount = maxLines;
    }

    if (Math.random() < 0.1) {
      fileLength++;
    }
  }

  scrollInterval = setInterval(addNewFile, scrollSpeed);
  timerInterval = setInterval(updateTimer, 1000);

  // Handle cancel attempts (ESC or button)
  const handleCancel = () => {
    cancelAttempts++;
    // Make it exponentially faster with each attempt
    scrollSpeed = Math.max(20, Math.floor(500 / (cancelAttempts * 2)));
    clearInterval(scrollInterval);
    scrollInterval = setInterval(addNewFile, scrollSpeed);
    
    // Update button text
    modal.querySelector('.button').textContent = 'All Your Storage Are Belong To Us!';
  };

  // Handle CTRL+C
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'c' && e.ctrlKey) {
      clearInterval(scrollInterval);
      clearInterval(timerInterval);
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  // Add cancel button handler
  modal.querySelector('.button').addEventListener('click', handleCancel);
  document.addEventListener('keydown', handleKeyDown);
}

// Update the CSS for the archive extraction
const style = document.createElement('style');
style.textContent = `
  .archive-modal-content {
    width: 500px;
    max-width: 90%;
  }

  .archive-body {
    height: 300px;
    overflow: hidden;
    padding: 10px;
    text-align: left;
    background-color: #0000AF;
  }

  .file-scroll-container {
    font-family: 'Courier New', monospace;
    color: #50FFFF;
    line-height: 1.2;
  }

  .file-scroll-container div {
    white-space: nowrap;
    padding: 1px 0;
  }

  .progress-text {
    color: #50FFFF;
    font-family: 'Courier New', monospace;
  }
`;
document.head.appendChild(style);

// Modify handleFileClick to handle archive files
function handleFileClick(item, laneId, laneElement, event) {
  const currentTime = new Date().getTime();
  const isDoubleClick = (currentTime - lastClickTime) < 300;
  lastClickTime = currentTime;

  if (isDoubleClick) {
    if (item.name === 'S3CR3T.TXT') {
      showSystemInfoModal();
      return;
    }
    if (item.isFolder) {
      currentLevel[laneId]++;
      const newContent = generateRandomContent();
      renderContent(laneElement, newContent);
      resetFileDetails();
    } else if (archiveExtensions.some(ext => item.name.toUpperCase().endsWith(ext))) {
      showArchiveExtraction(item.name);
    } else if (['.EXE', '.COM', '.BAT'].some(ext => item.name.toUpperCase().endsWith(ext))) {
      beep();
      const modal = document.getElementById('game-modal');
      modal.querySelector('.modal-header').textContent = item.name;
      modal.style.display = 'block';
      initGame();
    } else if (imageExtensions.some(ext => item.name.toUpperCase().endsWith(ext))) {
      showImageViewer(item.name);
    }
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
    // Don't show details for ".."
    if (fileName === '..') return;
    
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

// Modify the window.onload function to handle Quit button differently
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
      if (button.textContent.includes('Quit')) {
        showBSOD();
      } else {
        showErrorModal(generateGibberish());
      }
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

  document.querySelector('#game-modal .button').addEventListener('click', endGame);

  // Add keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Set initial selection in left window
  const firstFile = document.querySelector('#window1 .file');
  if (firstFile) {
    selectFile(firstFile);
  }
  
  // Add click handlers to windows to switch active window
  ['window1', 'window2'].forEach(windowId => {
    document.getElementById(windowId).addEventListener('click', () => {
      activeWindow = windowId;
    });
  });

  const inputField = document.querySelector('.input-area input');
  
  inputField.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (historyIndex < 0) historyIndex = 0;
        inputField.value = commandHistory[historyIndex];
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex >= 0) {
          historyIndex = -1;
          inputField.value = commandHistory[0];
        }
        break;
        
      case 'Enter':
        if (inputField.value.toUpperCase() === 'DOOM.EXE') {
          showDoomScreen();
        }
        inputField.value = '';
        historyIndex = -1;
        break;
    }
  });
};

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
  beep();
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

// Add these new functions for the image viewer
function showImageViewer(fileName) {
  beep();
  let modal = document.getElementById('image-modal');
  if (!modal) {
    modal = createImageModal();
  }
  
  modal.querySelector('.modal-header').textContent = fileName;
  modal.style.display = 'block';
  
  const canvas = document.getElementById('image-viewer');
  generateRetroImage(canvas, fileName);  // Pass fileName here
  
  const closeBtn = modal.querySelector('.button');
  closeBtn.onclick = () => modal.style.display = 'none';
  
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

function createImageModal() {
  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content image-modal-content">
      <div class="modal-header">Image Viewer</div>
      <div class="modal-body">
        <canvas id="image-viewer" width="320" height="200"></canvas>
      </div>
      <div class="modal-footer">
        <div class="button">Close</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function generateRetroImage(canvas, fileName) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // DOS-era 256 color palette (just a subset for this example)
  const palette = [
    '#000000', '#0000AA', '#00AA00', '#00AAAA',
    '#AA0000', '#AA00AA', '#AAAA00', '#AAAAAA',
    '#555555', '#5555FF', '#55FF55', '#55FFFF',
    '#FF5555', '#FF55FF', '#FFFF55', '#FFFFFF'
  ];
  
  // Generate deterministic pattern based on filename
  let hash = fileName.split('').reduce((acc, char) => {  // Changed to 'let' from 'const'
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use hash to determine pattern (0-3)
  const pattern = Math.abs(hash) % 4;
  
  // Use hash to seed random values
  const seededRandom = () => {
    // Simple LCG using hash as seed
    hash = (1664525 * hash + 1013904223) % 4294967296;
    return (hash / 4294967296);
  };
  
  switch(pattern) {
    case 0: // Random noise
      for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
          ctx.fillStyle = palette[Math.floor(seededRandom() * palette.length)];
          ctx.fillRect(x, y, 1, 1);
        }
      }
      break;
      
    case 1: // Gradient bands
      for(let y = 0; y < height; y++) {
        ctx.fillStyle = palette[Math.floor((y / height) * palette.length)];
        ctx.fillRect(0, y, width, 1);
      }
      break;
      
    case 2: // Checkerboard
      const size = 16;
      for(let y = 0; y < height; y += size) {
        for(let x = 0; x < width; x += size) {
          ctx.fillStyle = palette[Math.floor(seededRandom() * palette.length)];
          ctx.fillRect(x, y, size, size);
        }
      }
      break;
      
    case 3: // Circles
      ctx.fillStyle = palette[0];
      ctx.fillRect(0, 0, width, height);
      for(let i = 0; i < 20; i++) {
        const x = seededRandom() * width;
        const y = seededRandom() * height;
        // Ensure radius is positive by using Math.abs()
        const radius = Math.abs(10 + seededRandom() * 40);
        ctx.fillStyle = palette[Math.floor(seededRandom() * palette.length)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
}

// Add this function to create BSOD
function showBSOD() {
  beep();
  // Prevent tab closing/reloading
  window.onbeforeunload = function() {
    return "System is unresponsive";
  };

  const bsodContent = {
    title: "**** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000003, 0x00000004)",
    content: [
      "IRQL_NOT_LESS_OR_EQUAL",
      "",
      "*** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000003, 0x00000004)",
      "",
      "A problem has been detected and Windows has been shut down to prevent damage",
      "to your computer.",
      "",
      "Technical information:",
      "",
      "*** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000003, 0x00000004)",
      "",
      "If this is the first time you've seen this Stop error screen,",
      "restart your computer. If this screen appears again, follow",
      "these steps:",
      "",
      "Check for viruses on your computer. Remove any newly installed",
      "hard drives or hard drive controllers. Check your hard drive",
      "to make sure it is properly configured and terminated.",
      "Run CHKDSK /F to check for hard drive corruption, and then",
      "restart your computer.",
      "",
      "Beginning dump of physical memory",
      "Physical memory dump complete.",
      "Contact your system administrator or technical support group",
      "for further assistance."
    ]
  };

  // Create BSOD modal
  const modal = document.createElement('div');
  modal.className = 'modal bsod-modal';
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content bsod-content">
      <div class="bsod-text">
        ${bsodContent.content.join('<br>')}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Remove all other event listeners
  document.querySelectorAll('*').forEach(element => {
    element.replaceWith(element.cloneNode(true));
  });

  // Prevent keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // Add flickering effect
  let flickerIntensity = 0.97;
  setInterval(() => {
    flickerIntensity = 0.97 + Math.random() * 0.03;
    modal.style.filter = `brightness(${flickerIntensity})`;
    
    // Occasionally add scan lines effect
    if (Math.random() < 0.1) {
      modal.style.backgroundImage = 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)';
      modal.style.backgroundSize = '100% 4px';
      setTimeout(() => {
        modal.style.backgroundImage = 'none';
      }, 50);
    }
  }, 100);
}

// Add this function to show system info in a modal
function showSystemInfoModal() {
  beep();
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content system-info-content">
      <div class="modal-header">
        S3CR3T.TXT
      </div>
      <div class="modal-body system-info-body">
        <pre>${getSystemInfo()}</pre>
      </div>
      <div class="modal-footer">
        <div class="button">Close</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add close handler
  const closeBtn = modal.querySelector('.button');
  closeBtn.onclick = () => document.body.removeChild(modal);
  
  // Close on Escape
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// Add this function to show welcome modal
function showWelcomeModal() {
  beep();
  const modal = document.getElementById('welcome-modal');
  modal.style.display = 'block';

  // Add click handler for the OK button
  const buttons = modal.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  // Also close on Enter key
  document.addEventListener('keydown', function handleEnter(e) {
    if (e.key === 'Enter' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEnter);
    }
  });
}

// Add this near the top with other constants
const commandHistory = ['DOOM.EXE'];
let historyIndex = -1;

// Add DOOM viewer function
function showDoomScreen() {
  beep();
  const modal = document.createElement('div');
  modal.className = 'modal doom-modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content doom-content">
      <canvas id="doom-screen" width="320" height="200"></canvas>
    </div>
  `;

  document.body.appendChild(modal);
  
  const canvas = document.getElementById('doom-screen');
  const ctx = canvas.getContext('2d');
  
  function drawDoomScene() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 80);
    skyGradient.addColorStop(0, '#600000');
    skyGradient.addColorStop(1, '#300000');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 320, 80);

    // Mountains in background
    ctx.beginPath();
    ctx.fillStyle = '#200000';
    ctx.moveTo(0, 80);
    for(let x = 0; x < 320; x += 20) {
      ctx.lineTo(x, 60 + Math.sin(x/30) * 15);
    }
    ctx.lineTo(320, 80);
    ctx.fill();
    
    // Floor with perspective
    const floorGradient = ctx.createLinearGradient(0, 100, 0, 200);
    floorGradient.addColorStop(0, '#400000');
    floorGradient.addColorStop(1, '#200000');
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, 100, 320, 100);

    // Draw grid on floor for perspective
    ctx.strokeStyle = '#500000';
    ctx.lineWidth = 1;
    for(let z = 0; z < 10; z++) {
      const y = 100 + (z * 10);
      const perspective = z / 10;
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(320, y);
      ctx.stroke();
      
      // Vertical lines with perspective
      for(let x = 0; x < 320; x += 40) {
        const startX = x + (160 - x) * perspective * 0.7;
        const endX = x + (160 - x) * (perspective + 0.1) * 0.7;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y + 10);
        ctx.stroke();
      }
    }

    // Draw walls with texture
    for(let x = 0; x < 320; x += 60) {
      const height = 70 + Math.sin(x/40) * 10;
      const y = 90 - height;
      
      // Main wall
      const wallGradient = ctx.createLinearGradient(x, 0, x + 55, 0);
      wallGradient.addColorStop(0, '#8B0000');
      wallGradient.addColorStop(1, '#580000');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, 55, height);

      // Wall texture
      ctx.fillStyle = '#450000';
      for(let tx = 0; tx < 55; tx += 10) {
        for(let ty = 0; ty < height; ty += 10) {
          if((tx + ty) % 20 === 0) {
            ctx.fillRect(x + tx, y + ty, 8, 8);
          }
        }
      }
    }

    // Add "demons"
    const demonSprites = [
      {x: 50, y: 70, size: 30},
      {x: 150, y: 85, size: 25},
      {x: 250, y: 75, size: 28}
    ];

    demonSprites.forEach(demon => {
      // Body
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(demon.x, demon.y, demon.size, demon.size * 1.2);
      
      // Horns
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(demon.x, demon.y);
      ctx.lineTo(demon.x - 5, demon.y - 10);
      ctx.lineTo(demon.x + 5, demon.y);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(demon.x + demon.size, demon.y);
      ctx.lineTo(demon.x + demon.size + 5, demon.y - 10);
      ctx.lineTo(demon.x + demon.size - 5, demon.y);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(demon.x + demon.size * 0.2, demon.y + demon.size * 0.3, 5, 5);
      ctx.fillRect(demon.x + demon.size * 0.6, demon.y + demon.size * 0.3, 5, 5);
    });

    // Add HUD
    ctx.fillStyle = '#FF0000';
    ctx.font = '10px Courier';
    ctx.fillText('HEALTH: 100%', 10, 190);
    ctx.fillText('AMMO: 50', 250, 190);
    
    // Add weapon
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(120, 140, 80, 60);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(150, 150, 20, 40);
  }
  
  drawDoomScene();
  
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }
  
  document.addEventListener('keydown', handleKeyDown);
}

// Add DOOM screen styles
const doomStyle = document.createElement('style');
doomStyle.textContent = `
  .doom-modal {
    background-color: #000000;
  }
  
  .doom-content {
    background-color: #000000;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #doom-screen {
    image-rendering: pixelated;
    width: 100vw;
    height: 100vh;
    object-fit: contain;
  }
`;
document.head.appendChild(doomStyle);

// Add this near the top with other constants
function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}


