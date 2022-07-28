import './style.css'

document.querySelector('#app').innerHTML = `
<div class="container">

<div class="follow-element" style="left: 300px">
This element will follow the active draggable element ...
</div>

<div style="top: 0px; left: 0px" class="box"></div>
<div style="top: 100px; left: 100px" class="box"></div>
<div style="top: 200px; left: 200px" class="box"></div>
<div style="top: 300px; left: 300px" class="box"></div>

</div>
`
// get boxes from the DOM:
const container = document.querySelector('.container');

// get tooltip from the DOM:
const tooltip = document.querySelector('.follow-element');


// add event listeners to the container:
container.addEventListener('pointerdown', userPressed, { passive: true });

var element, bbox, startX, startY, deltaX, deltaY, raf;

function userPressed(event) {
  element = event.target;
  if (element.classList.contains('box')) {
    startX = event.clientX;
    startY = event.clientY;
    bbox = element.getBoundingClientRect();
    container.addEventListener('pointermove', userMoved, { passive: true });
    container.addEventListener('pointerup', userReleased, { passive: true });
    container.addEventListener('pointercancel', userReleased, { passive: true });
  };
};


// this function is called on every mousemove event:
function userMoved(event) {
  // if no previous request for animation frame - we allow js to proccess 'move' event:
  if (!raf) {
    deltaX = event.clientX - startX;
    deltaY = event.clientY - startY;
    raf = requestAnimationFrame(userMovedRaf);
  }
};

// this function is called on every animation frame:
function userMovedRaf() {
  element.style.transform = "translate3d("+deltaX+"px,"+deltaY+"px, 0px)";
  element.style.background = "hsl("+deltaX+","+deltaY+"%,50%)";
  // once the paint job is done we 'release' animation frame variable to allow next paint job:
  raf = null;
};

// manage mouseup and pointercancel events:
function userReleased(event) {
  container.removeEventListener('pointermove', userMoved);
  container.removeEventListener('pointerup', userReleased);
  container.removeEventListener('pointercancel', userReleased);
  // if animation frame was scheduled but the user already stopped interaction - we cancel the scheduled frame:
  if (raf) {
    cancelAnimationFrame(raf);
    raf = null;
  };
  element.style.left = bbox.left + deltaX + "px";
  element.style.top = bbox.top + deltaY + "px";

  // set the tooltip position:
  tooltip.style.left = bbox.left + deltaX - 10 + "px";
  tooltip.style.top = bbox.top + deltaY - 120 + "px";

  element.style.background = "hsl("+deltaX+","+deltaY+"%,50%)";
  element.style.transform = "translate3d(0px,0px,0px)";
  deltaX = deltaY = null;
};