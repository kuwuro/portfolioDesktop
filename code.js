const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const areaWidth = screenWidth * 0.5;
const areaHeight = screenHeight * 0.5;
const areaLeft = (screenWidth - areaWidth) / 2;
const areaTop = (screenHeight - areaHeight) / 2;
var startMenuOpen = false;
var windowsOpen = 0;
var focusedWindow = null;

document.getElementById("taskbar").style.zIndex = "0";
const bootOverlay = document.createElement("div");
bootOverlay.style.margin = "0";
bootOverlay.style.padding = "0";
bootOverlay.style.position = "fixed";
bootOverlay.style.zIndex = "2000";
bootOverlay.style.top = "0";
bootOverlay.style.left = "0";
bootOverlay.style.width = "100%";
bootOverlay.style.height = "100%";
bootOverlay.style.backgroundColor = "black";
bootOverlay.style.opacity = "1";
bootOverlay.style.transition = "opacity 1s";
document.body.appendChild(bootOverlay);
const bootLogo = document.createElement("img");
bootLogo.src = "media/loading.gif";
bootLogo.style.position = "fixed";
bootLogo.style.zIndex = "2001";
bootLogo.style.top = "50%";
bootLogo.style.left = "50%";
bootLogo.style.transform = "translate(-50%, -50%)";
bootLogo.style.width = "50px";
bootLogo.style.height = "50px";
document.body.appendChild(bootLogo);

window.onload = function () {  
  function fadeToBlack() {
    bootOverlay.style.opacity = "0";
    document.getElementById("taskbar").style.zIndex = "2000";
  }  
  setTimeout(fadeToBlack, 300);
  bootOverlay.addEventListener("transitionend", function () {
    bootOverlay.remove();
    bootLogo.remove();
  });
}

const desktopIcons = [
  { id: "myPC", label: "My PC", iconSrc: "media/root.png", action: () => myPC() },
  { id: "about", label: "About", iconSrc: "media/notepad.png", action: () => about() },
  { id: "experience", label: "Experience", iconSrc: "media/experience.png", action: () => experience() },
  { id: "contact", label: "Contact", iconSrc: "media/contact.png", action: () => contact() },
  { id: "help", label: "Help", iconSrc: "media/help.png", action: () => help()},
  { id: "projects", label: "Projects", iconSrc: "media/projects.png", action: () => projects()},
  { id: "goback", label: "Switch portfolio", iconSrc: "media/goback.png", action: () => goBack()},
  { id: "browser1", label: "DeltaBark's", iconSrc: "media/deltabarks.png", action: () => browser("https://www.deltabarks.com") },
  { id: "browser2", label: "Psycomputers", iconSrc: "media/psycomputers.png", action: () => browser("https://enricarmengol.github.io/psycomputers/") },
  { id: "browser3", label: "Can Mauri", iconSrc: "media/canmauri.png", action: () => browser("https://canmauri.com/") },
  { id: "browser4", label: "DeltaShop", iconSrc: "media/deltashop.png", action: () => browser("https://enricarmengol.github.io/deltashop/") },
];

function generateDesktopIcons() {
  const desktopIconsTable = document.getElementById("desktopIconsTable");
  const numRows = 7;
  const numCols = 13;

  const iconPositions = {
    "myPC": { row: 0, col: 0 },
    "projects": { row: 0, col: 1 },
    "browser1": { row: 0, col: 2 },
    "browser3": { row: 0, col: 3 },
    "help": { row: 0, col: 11 },
    "goback": { row: 0, col: 12 },
    "about": { row: 1, col: 0 },
    "browser2": { row: 1, col: 1 },
    "browser4": { row: 1, col: 2 },
    "experience": { row: 2, col: 0 },
    "contact": { row: 3, col: 0 },
  };

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("td");
      const cellId = `cell_${i}_${j}`;
      cell.id = cellId;

      const iconId = Object.keys(iconPositions).find(
        (iconId) => iconPositions[iconId].row === i && iconPositions[iconId].col === j
      );

      if (iconId) {
        const icon = desktopIcons.find((item) => item.id === iconId);
        const iconElement = createIconElement(icon);
        cell.appendChild(iconElement);
      }

      cell.addEventListener("dragover", handleDragOver);
      cell.addEventListener("drop", (e) => handleDrop(e, cellId));

      row.appendChild(cell);
    }
    desktopIconsTable.appendChild(row);
  }
}

function createIconElement(icon) {
  const iconElement = document.createElement("div");
  iconElement.id = icon.id + "Button";
  iconElement.className = "icon";
  iconElement.draggable = true;
  iconElement.innerHTML = `
    <img src="${icon.iconSrc}" alt="${icon.label}">
    <p>${icon.label}</p>
  `;
  iconElement.addEventListener("dragstart", (e) => handleDragStart(e, icon.id));
  iconElement.addEventListener("drop", (e) => handleDrop(e, icon.id));

  return iconElement;
}

function handleDragStart(e, iconId) {
  e.dataTransfer.setData("text/plain", iconId);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e, targetCellId) {
  e.preventDefault();
  const draggedIconId = e.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedIconId + "Button");
  const targetCell = document.getElementById(targetCellId);

  if (draggedElement && targetCell) {
    const draggedCell = draggedElement.closest("td");
    if (draggedCell !== targetCell) {
      const tempCell = document.createElement("td");

      draggedCell.replaceWith(tempCell);
      targetCell.replaceWith(draggedCell);
      tempCell.replaceWith(targetCell);

      const draggedIcon = desktopIcons.find((item) => item.id + "Button" === draggedIconId);
      const targetIcon = desktopIcons.find((item) => item.id + "Button" === draggedCell.id.replace("cell_", ""));

      if (draggedIcon) {
        draggedCell.addEventListener("click", () => draggedIcon.action());
      }

      if (targetIcon) {
        targetCell.addEventListener("click", () => targetIcon.action());
      }
    }
  }
}

generateDesktopIcons();

// Clock
function currentTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  hh = (hh < 10) ? "0" + hh : hh;
  mm = (mm < 10) ? "0" + mm : mm;
  ss = (ss < 10) ? "0" + ss : ss;

  let time = hh + ":" + mm  + ":" + ss;

  document.getElementById("time").innerText = time;
  var t = setTimeout(function () {
    currentTime()
  }, 1000);

}
currentTime();

// Drag window
function makeDraggable(windowId) {
  const windowElement = document.getElementById(windowId);
  const topbar = windowElement.querySelector(".topbar");

  let prevX = 0;
  let prevY = 0;

  topbar.addEventListener("mousedown", mousedown);
  topbar.addEventListener("selectstart", function (e) {
    e.preventDefault();
  });

  function mousedown(e) {
    e.preventDefault();
    bringToFront(windowId);
    prevX = e.clientX;
    prevY = e.clientY;
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }

  function mousemove(e) {
    let newX = e.clientX - prevX;
    let newY = e.clientY - prevY;
    const rect = windowElement.getBoundingClientRect();
    windowElement.style.left = rect.left + newX + "px";
    windowElement.style.top = rect.top + newY + "px";
    prevX = e.clientX;
    prevY = e.clientY;
  }

  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
  }
}

// Resize window
function makeResizable(windowId) {
  const windowElement = document.getElementById(windowId);
  const resizers = windowElement.getElementsByClassName("resizer");

  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < resizers.length; i++) {
    const currentResizer = resizers[i];

    currentResizer.addEventListener("mousedown", function (e) {
      e.preventDefault();
      bringToFront(windowId);
      rect = windowElement.getBoundingClientRect();
      prevX = e.clientX;
      prevY = e.clientY;
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    });

    function mousemove(e) {
      const rect = windowElement.getBoundingClientRect();
      if (currentResizer.classList.contains("br")) {
        windowElement.style.width = rect.width + (e.clientX - prevX) + "px";
        windowElement.style.height = rect.height + (e.clientY - prevY) + "px";
      } else if (currentResizer.classList.contains("bl")) {
        windowElement.style.width = rect.width + (prevX - e.clientX) + "px";
        windowElement.style.height = rect.height + (e.clientY - prevY) + "px";
        windowElement.style.left = rect.left + (e.clientX - prevX) + "px";
      } else if (currentResizer.classList.contains("tr")) {
        windowElement.style.width = rect.width + (e.clientX - prevX) + "px";
        windowElement.style.height = rect.height + (prevY - e.clientY) + "px";
        windowElement.style.top = rect.top + (e.clientY - prevY) + "px";
      } else if (currentResizer.classList.contains("tl")) {
        windowElement.style.width = rect.width + (prevX - e.clientX) + "px";
        windowElement.style.height = rect.height + (prevY - e.clientY) + "px";
        windowElement.style.top = rect.top + (e.clientY - prevY) + "px";
        windowElement.style.left = rect.left + (e.clientX - prevX) + "px";
      } else if (currentResizer.classList.contains("t")) {
        windowElement.style.height = rect.height + (prevY - e.clientY) + "px";
        windowElement.style.top = rect.top + (e.clientY - prevY) + "px";
      } else if (currentResizer.classList.contains("b")) {
        windowElement.style.height = rect.height + (e.clientY - prevY) + "px";
      } else if (currentResizer.classList.contains("l")) {
        windowElement.style.width = rect.width + (prevX - e.clientX) + "px";
        windowElement.style.left = rect.left + (e.clientX - prevX) + "px";
      } else if (currentResizer.classList.contains("r")) {
        windowElement.style.width = rect.width + (e.clientX - prevX) + "px";
      }

      prevX = e.clientX;
      prevY = e.clientY;
    }

    function mouseup() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    }
  }
}

function minimize(windowId, taskbarBlockId) {
  const windowElement = document.getElementById(windowId);
  const taskbarBlock = document.getElementById(taskbarBlockId);

  // Check if the window is already minimized
  if (windowElement.style.display === "none") {
    // Toggle the window's display and taskbar block class
    windowElement.style.display = "block";
    taskbarBlock.classList.remove("taskbar-block");
    taskbarBlock.classList.add("taskbar-block-selected");
    bringToFront(windowId);
  } 
  else {
    // Check if the window is focused
    if (windowElement.classList.contains("inactive-window")) {
      // If not focused, bring it to the front
      bringToFront(windowId);
    } else {
      // Toggle the window's display and taskbar block class
      windowElement.style.display = "none";
      taskbarBlock.classList.add("taskbar-block");
      taskbarBlock.classList.remove("taskbar-block-selected");
    }
  }
}

// Maximize window
let isMaximized = {};
let originalDimensions = {};

function maximize(windowId) {
  const windowElement = document.getElementById(windowId);
  
  if (isMaximized[windowId]) {
    const { width, height, top, left } = originalDimensions[windowId];
    windowElement.style.width = width;
    windowElement.style.height = height;
    windowElement.style.top = top;
    windowElement.style.left = left;
    isMaximized[windowId] = false;
  } else {
    originalDimensions[windowId] = {
      width: windowElement.style.width,
      height: windowElement.style.height,
      top: windowElement.style.top,
      left: windowElement.style.left
    };    
    windowElement.style.width = "100%";
    windowElement.style.height = "calc(100% - 40px)";
    windowElement.style.top = "0px";
    windowElement.style.left = "0px";
    isMaximized[windowId] = true;
  }
}

function closeWindow(windowId, taskbarBlockId) {
  const windowElement = document.getElementById(windowId);
  const taskbarBlock = document.getElementById(taskbarBlockId);
  windowElement.remove();
  taskbarBlock.remove();
  windowsOpen--;
}

document.addEventListener("mousedown", function (event) {
  const clickedWindow = event.target.closest(".window");
  const clickedTaskbar = event.target.closest("#taskbar");
  const clickedIframe = event.target.closest("iframe");
  const clickedContent = event.target.closest(".content");

  // Check if the clicked element is a window
  if (clickedWindow) {
    bringToFront(clickedWindow.id);
  } else if (!clickedTaskbar && !clickedIframe && !clickedContent) {
    // If the clicked element is not a window, taskbar item, or iframe, remove focus from all windows
    removeFocusFromAllWindows();
  }
});

function bringToFront(windowId) {
  const windowElement = document.getElementById(windowId);
  const windows = document.querySelectorAll(".window");
  
  // Check if the clicked window is already focused
  if (!windowElement.classList.contains("inactive-window")) {
    return;
  }

  // Remove grayscaling class from the active window
  windowElement.classList.remove("inactive-window");
  
  // Set the window's z-index to be the maximum + 1
  windowElement.style.zIndex = getHighestZIndex() + 1;
  
  // Apply grayscaling class to other windows
  windows.forEach((win) => {
    if (win !== windowElement) {
      win.classList.add("inactive-window");
    }
  });
  
  // Update taskbar icons based on the focused window
  updateTaskbarIcons(windowElement.id);
}

function updateTaskbarIcons(focusedWindowId) {
  const taskbarBlocks = document.querySelectorAll(".tb-icon");
  
  taskbarBlocks.forEach((block) => {
    const windowId = block.getAttribute("data-window-id");
    
    if (windowId === focusedWindowId) {
      block.classList.remove("taskbar-block");
      block.classList.add("taskbar-block-selected");
    } else {
      block.classList.remove("taskbar-block-selected");
      block.classList.add("taskbar-block");
    }
  });
}

// Function to remove focus from all windows
function removeFocusFromAllWindows() {
  const windows = document.querySelectorAll(".window");
  
  // Remove grayscaling class from all windows
  windows.forEach((win) => {
    win.classList.add("inactive-window");
  });
}

// Function to get the highest z-index among all windows
function getHighestZIndex() {
  const windows = document.querySelectorAll(".window");
  
  let maxZIndex = 0;
  windows.forEach((win) => {
    const zIndex = parseInt(win.style.zIndex, 10) || 0;
    maxZIndex = Math.max(maxZIndex, zIndex);
  });
  
  return maxZIndex;
}

// Start Menu
const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

startButton.addEventListener("click", function () {
  startButton.classList.toggle("start-menu-open");
  if (startMenuOpen) {
    startMenu.style.display = "none";
    startMenuOpen = false;    
  } else {
    startMenu.style.display = "flex";
    startMenuOpen = true;
  }
});

document.addEventListener("click", function (event) {
  if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
    startButton.classList.remove("start-menu-open");
    startMenu.style.display = "none";
    startMenuOpen = false;
  }
});

// My PC
const myPCButton = document.getElementById("myPCButton");
let clickCount = 0;
let clickTimeout;

myPCButton.addEventListener("click", function () {
  clickCount++;
  if (clickCount === 1) {
    myPCButton.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!myPCButton.contains(event.target)) {
        myPCButton.classList.remove("icon-selected");
      }
    });
    clickTimeout = setTimeout(function () {
      clickCount = 0;
    }, 300);
  } else if (clickCount === 2) {
    myPCButton.classList.remove("icon-selected");
    clearTimeout(clickTimeout);
    clickCount = 0;
    myPC();
  }
});

function myPC() {
  const windowId = "myPC_" + Math.random().toString(36).substr(2, 9);
  const taskbarBlockId = "taskbarBlock_" + Math.random().toString(36).substr(2, 9);

  document.getElementById("desktop").insertAdjacentHTML("beforeend", `
    <div id="${windowId}" class="window" style="display: none; z-index: ${windowsOpen}">
      <div class="resizer corner tl"></div>
      <div class="resizer corner tr"></div>
      <div class="resizer corner bl"></div>
      <div class="resizer corner br"></div>
      <div class="resizer t"></div>
      <div class="resizer b"></div>
      <div class="resizer l"></div>
      <div class="resizer r"></div>      
      <div class="body">
        <div class="topbar">
          <div class="windowname">
            <h3 class="font">My PC</h3>
          </div>
          <div class="btns">
            <button onclick="minimize('${windowId}', '${taskbarBlockId}')">_</button>
            <button onclick="maximize('${windowId}')">&#10064</button>
            <button onclick="closeWindow('${windowId}', '${taskbarBlockId}')">X</button>
          </div>
        </div>
        <div class="content">
          <div class="description">
            <h1>Enric Armengol</h1>
            <h2>web designer & developer</h2>
            <p>Welcome to my interactive portfolio.<br>Explore my work that merges aesthetics with functionality, and discover things you didn't think possible on a browser.</p>
          </div>
          <div class="image">
            <img src="media/pc.gif" alt="pc">
          </div>
        </div>
      </div>
    </div>`);
  windowsOpen++;
  const myPCElement = document.getElementById(windowId);
  myPCElement.style.display = "block";
  myPCElement.style.width = "700px";
  myPCElement.style.height = "350px";
  
  const randomLeft = Math.floor(Math.random() * (areaWidth - myPCElement.offsetWidth));
  const randomTop = Math.floor(Math.random() * (areaHeight - myPCElement.offsetHeight));
  
  myPCElement.style.top = areaTop + randomTop + "px";
  myPCElement.style.left = areaLeft + randomLeft + "px";
  
  document.getElementById("taskbarItems").insertAdjacentHTML("beforeend", `
    <div id="${taskbarBlockId}" data-window-id="${windowId}" onclick="minimize('${windowId}', '${taskbarBlockId}')" class="tb-icon taskbar-block font">
      <img src="media/root.png">
      <p>My PC</p>
    </div>
  `);
  makeResizable(windowId);
  makeDraggable(windowId);
  myPCElement.style.zIndex = getHighestZIndex() + 1;

  updateTaskbarIcons(windowId);
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    if (win !== myPCElement) {
      win.classList.add("inactive-window");
    }
  });
  myPCElement.addEventListener("mousedown", function () {
    bringToFront(windowId);
  });
}

// About Me
const aboutButton = document.getElementById("aboutButton");
let clickCount1 = 0;
let clickTimeout1;

aboutButton.addEventListener("click", function () {
  clickCount1++;
  if (clickCount1 === 1) {
    aboutButton.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!aboutButton.contains(event.target)) {
        aboutButton.classList.remove("icon-selected");
      }
    });
    clickTimeout1 = setTimeout(function () {
      clickCount1 = 0;
    }, 300);
  } else if (clickCount1 === 2) {
    aboutButton.classList.remove("icon-selected");
    clearTimeout(clickTimeout1);
    clickCount1 = 0;
    about();
  }
});

function about() {
  const windowId = "about_" + Math.random().toString(36).substr(2, 9);
  const taskbarBlockId = "taskbarBlock_" + Math.random().toString(36).substr(2, 9);

  document.getElementById("desktop").insertAdjacentHTML("beforeend", `
    <div id="${windowId}" class="window" style="display: none; z-index: ${windowsOpen}">
      <div class="resizer corner tl"></div>
      <div class="resizer corner tr"></div>
      <div class="resizer corner bl"></div>
      <div class="resizer corner br"></div>
      <div class="resizer t"></div>
      <div class="resizer b"></div>
      <div class="resizer l"></div>
      <div class="resizer r"></div>      
      <div class="body">
        <div class="topbar">
          <div class="windowname">
            <h3 class="font">About Me</h3>
          </div>
          <div class="btns">
            <button onclick="minimize('${windowId}', '${taskbarBlockId}')">_</button>
            <button onclick="maximize('${windowId}')">&#10064</button>
            <button onclick="closeWindow('${windowId}', '${taskbarBlockId}')">X</button>
          </div>
        </div>
        <div class="content">
          <div class="description">
          <p>this will be the about me page</p>
          </div>
          <div class="image">
            <img src="media/pc.gif" alt="pc">
          </div>
        </div>
      </div>
    </div>`);
  windowsOpen++;
  const aboutElement = document.getElementById(windowId);
  aboutElement.style.display = "block";
  aboutElement.style.width = "600px";
  aboutElement.style.height = "350px";

  const randomLeft = Math.floor(Math.random() * (areaWidth - aboutElement.offsetWidth));
  const randomTop = Math.floor(Math.random() * (areaHeight - aboutElement.offsetHeight));
  
  aboutElement.style.top = areaTop + randomTop + "px";
  aboutElement.style.left = areaLeft + randomLeft + "px";
  
  document.getElementById("taskbarItems").insertAdjacentHTML("beforeend", `
    <div id="${taskbarBlockId}" data-window-id="${windowId}" onclick="minimize('${windowId}', '${taskbarBlockId}')" class="tb-icon taskbar-block font">
      <img src="media/notepad.png">
      <p>About Me</p>
    </div>
  `);
  makeResizable(windowId);
  makeDraggable(windowId);
  aboutElement.style.zIndex = getHighestZIndex() + 1;

  updateTaskbarIcons(windowId);
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    if (win !== aboutElement) {
      win.classList.add("inactive-window");
    }
  });
  aboutElement.addEventListener("mousedown", function () {
    bringToFront(windowId);
  });
}

// Projects browser
// deltabarks
const browserButton = document.getElementById("browser1Button");
let clickCount2 = 0;
let clickTimeout2;

browserButton.addEventListener("click", function () {
  clickCount2++;
  if (clickCount2 === 1) {
    browserButton.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!browserButton.contains(event.target)) {
        browserButton.classList.remove("icon-selected");
      }
    });
    clickTimeout2 = setTimeout(function () {
      clickCount2 = 0;
    }, 300);
  } else if (clickCount2 === 2) {
    browserButton.classList.remove("icon-selected");
    clearTimeout(clickTimeout1);
    clickCount2 = 0;
    browser("https://www.deltabarks.com");
  }
});

// psycomputers
const browserButton2 = document.getElementById("browser2Button");
let clickCount3 = 0;
let clickTimeout3;

browserButton2.addEventListener("click", function () {
  clickCount3++;
  if (clickCount3 === 1) {
    browserButton2.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!browserButton2.contains(event.target)) {
        browserButton2.classList.remove("icon-selected");
      }
    });
    clickTimeout3 = setTimeout(function () {
      clickCount3 = 0;
    }, 300);
  } else if (clickCount3 === 2) {
    browserButton2.classList.remove("icon-selected");
    clearTimeout(clickTimeout1);
    clickCount3 = 0;
    browser("https://enricarmengol.github.io/psycomputers/");
  }
});

//can mauri
const browserButton3 = document.getElementById("browser3Button");
let clickCount4 = 0;
let clickTimeout4;

browserButton3.addEventListener("click", function () {
  clickCount4++;
  if (clickCount4 === 1) {
    browserButton3.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!browserButton3.contains(event.target)) {
        browserButton3.classList.remove("icon-selected");
      }
    });
    clickTimeout4 = setTimeout(function () {
      clickCount4 = 0;
    }, 300);
  } else if (clickCount4 === 2) {
    browserButton3.classList.remove("icon-selected");
    clearTimeout(clickTimeout1);
    clickCount4 = 0;
    browser("https://canmauri.com/");
  }
});

// deltashop
const browserButton4 = document.getElementById("browser4Button");
let clickCount5 = 0;
let clickTimeout5;

browserButton4.addEventListener("click", function () {
  clickCount5++;
  if (clickCount5 === 1) {
    browserButton4.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!browserButton4.contains(event.target)) {
        browserButton4.classList.remove("icon-selected");
      }
    });
    clickTimeout5 = setTimeout(function () {
      clickCount5 = 0;
    }, 300);
  } else if (clickCount5 === 2) {
    browserButton4.classList.remove("icon-selected");
    clearTimeout(clickTimeout1);
    clickCount5 = 0;
    browser("https://enricarmengol.github.io/deltashop/");
  }
});

function visit() {
  var addressInput = document.getElementById('address');
  var iframe = document.getElementById('my_iframe');
  iframe.src = addressInput.value;
}

function openTab(target) {
  window.open(target, '_blank');
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
      visit();
  }
}

function browser(option) {
  const windowId = "about_" + Math.random().toString(36).substr(2, 9);
  const taskbarBlockId = "taskbarBlock_" + Math.random().toString(36).substr(2, 9);

  document.getElementById("desktop").insertAdjacentHTML("beforeend", `
    <div id="${windowId}" class="window" style="display: none; z-index: ${windowsOpen}">
      <div class="resizer corner tl"></div>
      <div class="resizer corner tr"></div>
      <div class="resizer corner bl"></div>
      <div class="resizer corner br"></div>
      <div class="resizer t"></div>
      <div class="resizer b"></div>
      <div class="resizer l"></div>
      <div class="resizer r"></div>      
      <div class="body">
        <div class="topbar">
          <div class="windowname">
            <h3 class="font">Browser</h3>
          </div>
          <div class="btns">
            <button onclick="minimize('${windowId}', '${taskbarBlockId}')">_</button>
            <button onclick="maximize('${windowId}')">&#10064</button>
            <button onclick="closeWindow('${windowId}', '${taskbarBlockId}')">X</button>
          </div>
        </div>
        <div class="browserContent">
          <table id="frame" height="100%" width="100%" border="0">
              <tr>
                  <td style="margin: 0px; height: 35px;">
                      <div id="addressbar">
                        <input type="text" id="address" value="${option}" onkeypress="handleKeyPress(event)">
                        <button onclick="visit()">Go</button>
                        <button onclick="openTab('${option}')">Open in a new tab</button>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td class="iframe_loading"><iframe id="my_iframe" src="${option}" width="100%" height="100%"></iframe></td>
              </tr>
          </table>
        </div>
      </div>
    </div>`);
  windowsOpen++;
  const browserElement = document.getElementById(windowId);
  browserElement.style.display = "block";
  browserElement.style.width = "1000px";
  browserElement.style.height = "550px";

  const randomLeft = Math.floor(Math.random() * (areaWidth - browserElement.offsetWidth));
  const randomTop = Math.floor(Math.random() * (areaHeight - browserElement.offsetHeight));
  
  browserElement.style.top = areaTop + randomTop + "px";
  browserElement.style.left = areaLeft + randomLeft + "px";
  
  document.getElementById("taskbarItems").insertAdjacentHTML("beforeend", `
    <div id="${taskbarBlockId}" data-window-id="${windowId}" onclick="minimize('${windowId}', '${taskbarBlockId}')" class="tb-icon taskbar-block font">
      <img src="media/browser.png">
      <p>Browser</p>
    </div>
  `);
  maximize(windowId);
  makeResizable(windowId);
  makeDraggable(windowId);
  browserElement.style.zIndex = getHighestZIndex() + 1;

  updateTaskbarIcons(windowId);
  const windows = document.querySelectorAll(".window");
  windows.forEach((win) => {
    if (win !== browserElement) {
      win.classList.add("inactive-window");
    }
  });
  browserElement.addEventListener("mousedown", function () {
    bringToFront(windowId);
  });
}

const goBackButton = document.getElementById("gobackButton");
let clickCount6 = 0;
let clickTimeout6;

goBackButton.addEventListener("click", function () {
  clickCount6++;
  if (clickCount6 === 1) {
    goBackButton.classList.add("icon-selected");
    document.addEventListener("click", function (event) {
      if (!goBackButton.contains(event.target)) {
        goBackButton.classList.remove("icon-selected");
      }
    });
    clickTimeout6 = setTimeout(function () {
      clickCount6 = 0;
    }, 300);
  } else if (clickCount6 === 2) {
    goBackButton.classList.remove("icon-selected");
    clearTimeout(clickTimeout6);
    clickCount6 = 0;
    goBack();
  }
});

function goBack() {
  const overlay = document.createElement("div");
  overlay.style.margin = "0";
  overlay.style.padding = "0";
  overlay.style.position = "fixed";
  overlay.style.zIndex = "2000";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "black";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.5s";
  document.body.appendChild(overlay);

  const secondOverlay = document.createElement("div");
  secondOverlay.style.margin = "0";
  secondOverlay.style.padding = "0";
  secondOverlay.style.position = "fixed";
  secondOverlay.style.zIndex = "2001";
  secondOverlay.style.top = "0";
  secondOverlay.style.left = "0";
  secondOverlay.style.width = "100%";
  secondOverlay.style.height = "100%";
  secondOverlay.style.background = "url('media/wallpapers/wallpapertransition.png') no-repeat center center";
  secondOverlay.style.backgroundSize = "cover";
  secondOverlay.style.opacity = "0";
  secondOverlay.style.transition = "opacity 1.0s";
  document.body.appendChild(secondOverlay);

  function fadeToBlack() {
    overlay.style.opacity = "1";
    document.getElementById("taskbar").style.zIndex = "0";
  }

  setTimeout(fadeToBlack, 0);

  overlay.addEventListener("transitionend", function () {
    setTimeout(function () {
      secondOverlay.style.opacity = "1";
      secondOverlay.addEventListener("transitionend", function () {
        window.location.href = "https://portfolio-peach-chi-53.vercel.app";
      });
    }, 500);
  });
}