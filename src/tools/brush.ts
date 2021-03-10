import paper from 'paper';
import SynchronizedPath from '../classes/SynchronizedPath';
import getMedian from '../utils/getMedian';

export default function createBrushTool(): paper.Tool {
  let path: paper.Path;

  const tool = new paper.Tool();
  tool.minDistance = 1;
  var t = [];

  function onMouseDown(event: paper.ToolEvent) {
    path = new paper.Path();
    path.strokeColor = new paper.Color('black');
    path.add(event.point);
  }

  function onMouseDrag(event: paper.ToolEvent) {
    path.add(event.point);
    //var date = new Date();
    //var timesample = date.getTime();
    //t.push(timesample);
  }

  function onMouseUp(event: paper.ToolEvent) {
    // Send path over WebSocket
    new SynchronizedPath(path).send();

    // Corner detection algorithm
    var x = [];
    var y = [];

    var Sx = [];
    var Sy = [];
    var St = [];

    var D = 0;
    var straw = [];
    var totalStraw = 0;
    var w = 3;
    var deltaTime = [];
    var subStrokes = [];

    // Get x,y,t values for stroke
    for (let i = 0; i < path.length; i++) {
      const point = path.getPointAt(i);
      x.push(point.x);
      y.push(point.y);

    }
    // Determine S using Rubine F3 (Length of Bounding Box Diaganol)
    var xmax = Math.max(...x);
    var xmin = Math.min(...x);
    var ymax = Math.max(...y);
    var ymin = Math.min(...y);
    var Diag = Math.sqrt(((xmax - xmin)*(xmax - xmin))+((ymax - ymin)*(ymax - ymin)));
    var S = Math.round(Diag / 40);


    // Resample the stroke
    for (let i=1; i < x.length; i++) {
    var xdist = Math.abs( x[i] - x[i-1]);
    var ydist = Math.abs( y[i] - y[i-1]);
    D = D + Math.sqrt((xdist*xdist) + (ydist*ydist));
    if (D > S) {
      Sx.push(x[i]);
      Sy.push(y[i]);
      D = 0;
      var circle = new paper.Shape.Circle(new paper.Point(x[i], y[i]), 3);
      circle.fillColor = new paper.Color('black');
      }
    }

    // Compute Straws!
    for (let i=w; i < Sx.length - w; i++) {
      var strawStart = new paper.Point(Sx[i-w], Sy[i-w]);
      var strawEnd = new paper.Point(Sx[i+w], Sy[i+w]);
      var newStraw = new paper.Path.Line(strawStart, strawEnd);
      var newStrawLength = newStraw.length
      straw.push(newStrawLength);
    }
    // Find average straw length
    //for (i=0; i < straw.length; i++) {
    //		var totalStraw = totalStraw + straw[i];
    //}
    //var strawAvg = totalStraw / straw.length;

    // Find median straw length
    var sortedStraw = straw.slice(0);
    var strawMed = getMedian(sortedStraw);

    // Set threshold
    var threshold = strawMed * 0.95;

    // Consider time to reduce false positives
    // Find average deltatime

    //for (i=0; i < St.length; i++) {
    //	deltaTime.push(St[i+1] - St[i]);;
    //}
    //var totalDeltaTime = deltaTime[10] - deltaTime[0];
    //var avgDeltaTime = totalDeltaTime / deltaTime.length;

    //var timeThreshold = 0.9;
    // Find point candidates
    for (let i = w; i < Sx.length - w; i++) {
      if (straw[i] < threshold) {
          var localMin = 10000;
          var localMinIndex = i;
          while (i < straw.length && straw[i] < threshold) {

            if (straw[i] < localMin) {
              localMin = straw[i];
              localMinIndex = i;
            }
            i++;
          }

          // Split stroke
          //path.segments[i].
          //subStrokes.push()
          const corner = new paper.Shape.Circle(new paper.Point(Sx[i], Sy[i]), 8);
          corner.fillColor = new paper.Color('red')
      }
    }
  }

  tool.onMouseDown = onMouseDown;
  tool.onMouseDrag = onMouseDrag;
  tool.onMouseUp = onMouseUp;

  return tool;
}
