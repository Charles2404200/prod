/**
 * Carousel Utils Test
 *
 * Checks that `responsiveOneItemCarousel` exists
 * and always sets items=1 for desktop, tablet, and mobile.
 */

let responsiveOneItemCarousel;

beforeAll(() => {
  responsiveOneItemCarousel = require('../app/components/Common/CarouselSlider/utils.js')
    .responsiveOneItemCarousel;
});

describe('responsiveOneItemCarousel', () => {
  test('has desktop, tablet, and mobile with items=1', () => {
    expect(responsiveOneItemCarousel).toBeTruthy();
    ['desktop', 'tablet', 'mobile'].forEach(k => {
      expect(responsiveOneItemCarousel[k].items).toBe(1);
    });
  });
});
