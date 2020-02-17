import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TimelineMax, TweenMax} from 'gsap';

declare let Winwheel: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {

  title = 'winwheeljs3';
  theWheel: any;
  wheelPower = 0;
  wheelSpinning = false;
  winningSegment: string;
  buttonImage = '../assets/images/spin_off.png';

  constructor() {
  }

  ngAfterViewInit(): void {
    this.theWheel = new Winwheel({
      numSegments: 8,         // Number of segments
      outerRadius: 212,       // The size of the wheel.
      centerX: 217,       // Used to position on the background correctly.
      centerY: 219,
      textFontSize: 28,        // Font size.
      segments:            // Definition of all the segments.
        [
          {fillStyle: '#eae56f', text: 'Prize 1'},
          {fillStyle: '#89f26e', text: 'Prize 2'},
          {fillStyle: '#7de6ef', text: 'Prize 3'},
          {fillStyle: '#e7706f', text: 'Prize 4'},
          {fillStyle: '#eae56f', text: 'Prize 5'},
          {fillStyle: '#89f26e', text: 'Prize 6'},
          {fillStyle: '#7de6ef', text: 'Prize 7'},
          {fillStyle: '#e7706f', text: 'Prize 8'}
        ],
      animation:               // Definition of the animation
        {
          type: 'spinToStop',
          duration: 5,
          spins: 8,
          callbackFinished: this.alertPrize.bind(this)
          // callbackFinished: () => {
          //   this.winningSegment = this.theWheel.getIndicatedSegment();
          //   console.log('---> ', this.winningSegment);
          // }
          // callbackFinished: this.alertPrize(this.theWheel)
        },
      pointerGuide:        // Turn pointer guide on.
        {
          display: true,
          strokeStyle: 'red',
          lineWidth: 3
        }
    });
    console.log('WHEEL = ', this.theWheel);
  }

  ngOnInit(): void {
  }

  powerSelected(powerLevel) {
    if (this.wheelSpinning === false) {
      document.getElementById('pw1').className = '';
      document.getElementById('pw2').className = '';
      document.getElementById('pw3').className = '';
      if (powerLevel >= 1) {
        document.getElementById('pw1').className = 'pw1';
      }
      if (powerLevel >= 2) {
        document.getElementById('pw2').className = 'pw2';
      }
      if (powerLevel >= 3) {
        document.getElementById('pw3').className = 'pw3';
      }
      this.wheelPower = powerLevel;
      // document.getElementById('spin_button').src = 'spin_on.png';
      this.buttonImage = '../assets/images/spin_on.png';
      document.getElementById('spin_button').className = 'clickable';
    }
  }

  startSpin() {
    if (this.wheelSpinning === false) {
      if (this.wheelPower === 1) {
        this.theWheel.animation.spins = 3;
      } else if (this.wheelPower === 2) {
        this.theWheel.animation.spins = 8;
      } else if (this.wheelPower === 3) {
        this.theWheel.animation.spins = 15;
      }
    }
    this.buttonImage = '../assets/images/spin_off.png';
    document.getElementById('spin_button').className = '';
    this.theWheel.startAnimation(new TweenMax(new TimelineMax()));
    this.wheelSpinning = true;
    // this.alertPrize();
  }

  resetWheel() {
    this.theWheel.stopAnimation(false);
    this.theWheel.rotationAngle = 0;
    this.theWheel.draw();
    document.getElementById('pw1').className = '';  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = '';
    document.getElementById('pw3').className = '';
    this.wheelSpinning = false;
  }

  alertPrize() {
    console.log('Callback finished -', this.theWheel.getIndicatedSegment());
    this.winningSegment = this.theWheel.getIndicatedSegment().text;
    console.log('You have won ' + this.winningSegment);
    alert('You have won ' + this.theWheel.getIndicatedSegment().text);
  }

  getSegment(e) {
    // Call function to reset the segment colours.
    // resetSegmentColours();

    // Call the getSegmentAt function passing the mouse x and y from the event.
    const clickedSegment = this.theWheel.getSegmentAt(e.clientX, e.clientY);
    console.log('3-', this.theWheel.getIndicatedSegment());
    console.log('4-', clickedSegment);

    // A pointer to the segment clicked is returned if the user clicked inside the wheel.
    /*if (clickedSegment) {
      // Change background colour of the segment and update the wheel.
      clickedSegment.fillStyle = 'yellow';
      this.theWheel.draw();
      // Update span to say what was clicked.
      // clickedWhat.innerText = clickedSegment.text;
    }*/
  }

  calculatePrize() {
    // This formula always makes the wheel stop somewhere inside prize 3 at least
    // 1 degree away from the start and end edges of the segment.
    const stopAt = (91 + Math.floor((Math.random() * 43)));
    // const stopAt = (25 + Math.floor((Math.random() * 78)));
    console.log('Stop at angle must lie between 90 and 135 degrees - ', stopAt);
    // Important thing is to set the stopAngle of the animation before stating the spin.
    this.theWheel.animation.stopAngle = stopAt;
    // May as well start the spin from here.
    this.startSpin();
    // this.theWheel.animation.callbackFinished = console.log('This after animation ends - ', this.theWheel.getIndicatedSegment());
  }
}
