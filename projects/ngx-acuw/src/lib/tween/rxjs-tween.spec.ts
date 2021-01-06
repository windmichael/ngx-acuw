import { waitForAsync } from '@angular/core/testing';
import { RxjsTween } from './rxjs-tween';

describe('RxjsTween', () => {
  it('tween duration should match', (done) => {
    // To test the tween function the duration is measured, until the end value is reached

    let tweenVariable = 0;
    const startVal = 0;
    const endVal = 100;
    const tweenDuration = 2000;

    const startTime = (new Date()).getTime();
    let measuredDuration = 0;

    RxjsTween.createTween(RxjsTween.linear, startVal, endVal, tweenDuration).subscribe({
      next: x => {
        tweenVariable = x;
        if (tweenVariable === endVal) {
          measuredDuration = (new Date()).getTime() - startTime;
          console.log(measuredDuration);

          // Expect that the measured duration matches the demand duration (+/- 99 ms)
          expect(Math.round(tweenDuration / 100)).toEqual(Math.round(measuredDuration / 100));
          done();
        }
      }
    }
    );
  });
});
