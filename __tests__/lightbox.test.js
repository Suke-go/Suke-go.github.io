let openLightbox, closeLightbox, showSlide, currentSlide;

beforeEach(() => {
  jest.resetModules();
  ({ openLightbox, closeLightbox, showSlide, currentSlide } = require('../script.js'));

  document.body.innerHTML = `
    <div id="lightbox" style="display:none;"></div>
    <div class="art-piece">
      <img src="img1.jpg" />
      <div class="art-info"><h2>Caption 1</h2></div>
    </div>
    <div class="art-piece">
      <img src="img2.jpg" />
      <div class="art-info"><h2>Caption 2</h2></div>
    </div>
    <img id="lightbox-img" src="" />
    <div id="caption"></div>
  `;

  // jsdom does not implement innerText, so mock it using textContent
  document.querySelectorAll('h2,#caption').forEach(el => {
    Object.defineProperty(el, 'innerText', {
      get() { return el.textContent; },
      set(v) { el.textContent = v; }
    });
  });
});

test('openLightbox and closeLightbox toggle display', () => {
  const lightbox = document.getElementById('lightbox');
  expect(lightbox.style.display).toBe('none');

  openLightbox();
  expect(lightbox.style.display).toBe('block');

  closeLightbox();
  expect(lightbox.style.display).toBe('none');
});

test('showSlide updates lightbox image and caption', () => {
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('caption');

  showSlide(1);
  expect(img.src).toContain('img1.jpg');
  expect(caption.innerText).toBe('Caption 1');

  currentSlide(2);
  expect(img.src).toContain('img2.jpg');
  expect(caption.innerText).toBe('Caption 2');
});
