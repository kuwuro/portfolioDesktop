const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const areaWidth = screenWidth * 0.7;
const areaHeight = screenHeight * 0.7;
const areaLeft = (screenWidth - areaWidth) / 2;
const areaTop = (screenHeight - areaHeight) / 2;
var windowsOpen = 0;
var focusedWindow = null;

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
    windowElement.style.height = "100%";
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
  myPCElement.style.width = "600px";
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

  // Update taskbar icons based on the focused window
  updateTaskbarIcons(windowId);
  // Add the inactive-window class to all other windows
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

  // Update taskbar icons based on the focused window
  updateTaskbarIcons(windowId);
  // Add the inactive-window class to all other windows
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

document.addEventListener("mousedown", function (event) {
  const clickedWindow = event.target.closest(".window");
  const clickedTaskbar = event.target.closest("#taskbar");

  // Check if the clicked element is a window
  if (clickedWindow) {
    bringToFront(clickedWindow.id);
  } else if (!clickedTaskbar) {
    // If the clicked element is not a window and not a taskbar item, remove focus from all windows
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