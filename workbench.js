/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

var doc, screen, displayport;

function load() {
  doc = document.getElementById('document');
  screen = document.getElementById('screen');
  displayport = document.getElementById('displayport');

  screen.width = 48;
  screen.height = 80;

  displayport.width = 200;
  displayport.height = 200;
}

/**
 * All time values in the model here are slowed down by a factor of
 * 10.  So 1ms == 10ms in the model.
 */

var path = [
  { dxdt: 0, dydt: 10, t: 900 },
];

var t0 = 0, t_i1 = 0;
var pi = 0;

function reset() {
  pi = 0;
  t0 = t_i1 = window.mozAnimationStartTime;

  screen.x = 0;
  screen.y = 0;

  resetDisplayport();
}

function run() {
  reset();
  render();
  mozRequestAnimationFrame(sample);
}

function sample(t_i) {
  var pe = path[pi];
  var dt = t_i - t_i1;
  var et = t_i - t0;
  if (et >= pe.t) {
    dt = t0 + pe.t - t_i1;
    ++pi;
  }

  dt /= 10;

  screen.x += pe.dxdt * dt;
  screen.y += pe.dydt * dt;

  updateDisplayport();

  render();

  if (pi < path.length) {
    t_i1 = t_i;
    mozRequestAnimationFrame(sample);
  } else {
    // Done.
    setTimeout(function() { reset(); render(); }, 2000);
  }
}

//-----------------------------------------------------------------------------

function resetDisplayport() {
  displayport.x = 0;
  displayport.y = 0;
}

function updateDisplayport() {
  var sx = screen.x;
  var sy = screen.y;

  // XXX ignoring horizontal scrolling for now
  // XXX ignoring up-scrolling for now
  if ((sy + screen.height) > (displayport.y + displayport.height))
    redrawAt(sx, sy + screen.height);
}

var kDrawDelay = 100;         // milliseconds
var drawQ = [];
function redrawAt(x, y) {
  drawQ.push({ x: x, y: y});
  drawLoop();
}

function drawLoop() {
  if (drawQ.length)
    setTimeout(drawFinished, kDrawDelay / 10);
}

function drawFinished() {
  var fd = drawQ.shift();
  displayport.x = fd.x;
  displayport.y = fd.y;

  drawLoop();
}

//-----------------------------------------------------------------------------

function render() {
  screen.style.left = screen.x +'px';
  screen.style.top = screen.y +'px';
  window.scrollTo(screen.x - 10, screen.y - 10);
  displayport.style.left = displayport.x +'px';
  displayport.style.top = displayport.y +'px';

  recordStats();
}

function recordStats() {
  // fill me in
}