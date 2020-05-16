import { version } from '../package.json';
import RouteState from 'route-state';
import handleError from 'handle-error-web';
import curry from 'lodash.curry';
import domToImage from 'dom-to-image';

var formWired = false;
var textFieldEl = document.getElementById('text-field');
var fontSizeSliderEl = document.getElementById('font-size-slider');
var fontSizeLabelEl = document.getElementById('font-size-label');
// var imageSizeFieldEl = document.querySelector('input[name="image-size-field"]:checked');
var emojiTextEl = document.getElementById('emoji-text');
var buildButtonEl = document.getElementById('build-button');
var previewStageEl = document.getElementById('preview-stage');
var resultImageEl = document.getElementById('result-image');
var resultImageElSm = document.getElementById('result-image-sm');
var resultImageElXs = document.getElementById('result-image-xs');
var resultImageElSmDk = document.getElementById('result-image-sm-dk');
var resultImageElXsDk = document.getElementById('result-image-xs-dk');
var resultSectionEl = document.querySelector('.result');
var resultInstructionEl = document.getElementById('result-instruction');

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  window.onerror = reportTopLevelError;
  renderVersion();
  routeState.routeFromHash();
})();

function followRoute({ text = 'lol', fontSize = 128, imageSize = '256px' }) {
  updateForm({ text, fontSize, imageSize });
  renderPreview({ text, fontSize, imageSize });
  wireForm();
}

function updateForm({ text, fontSize, imageSize = '256px' }) {
  textFieldEl.value = text;
  fontSizeSliderEl.value = fontSize;
  fontSizeLabelEl.textContent = fontSize;
  // imageSizeFieldEl.value = imageSize;
}

function renderPreview({ text, fontSize, imageSize }) {
  emojiTextEl.style.fontSize = fontSize + 'px';
  emojiTextEl.textContent = text;
  previewStageEl.style.width = imageSize;
  previewStageEl.style.height = imageSize;
  resultImageEl.style.width = imageSize;
  resultImageEl.style.height = imageSize;
}

function wireForm() {
  if (formWired) {
    return;
  }

  textFieldEl.addEventListener(
    'keyup',
    curry(updateRoute)('text', textFieldEl)
  );
  fontSizeSliderEl.addEventListener(
    'change',
    curry(updateRoute)('fontSize', fontSizeSliderEl)
  );
  fontSizeSliderEl.addEventListener('change', updateFontSizeLabel);
  // imageSizeFieldEl.addEventListener(
  //   'change',
  //   curry(updateRoute)('imageSize', imageSizeFieldEl)
  // );
  buildButtonEl.addEventListener('click', onBuildClick);

  formWired = true;
}

function updateRoute(prop, inputEl, e) {
  e.composing;
  routeState.addToRoute({ [prop]: inputEl.value });
}

function updateFontSizeLabel() {
  fontSizeLabelEl.textContent = fontSizeSliderEl.value;
}

function onBuildClick() {
  resultSectionEl.classList.remove('hidden');
  domToImage
    .toPng(previewStageEl)
    .then(renderResult)
    .catch(handleError);
}

function renderResult(dataURL) {
  resultImageEl.src = dataURL;
  resultImageElSm.src = dataURL;
  resultImageElXs.src = dataURL;
  resultImageElSmDk.src = dataURL;
  resultImageElXsDk.src = dataURL;
  // resultImageEl.classList.remove('hidden');
  resultInstructionEl.classList.remove('hidden');
}

function renderVersion() {
  document.getElementById('version-info').textContent = version;
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
