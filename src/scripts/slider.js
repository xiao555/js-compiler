import $ from 'jquery';
import 'bxslider'
import skrollr from './skrollr'
import {isMobile} from './until'
var els = {}

function init() {
  $('[data-slider-options]').each(function(index, el) {
    var slider = {}
    slider.options = $(el).data('slider-options') || {}
    slider.options.onSlideAfter = onSlideAfter
    if (isMobile()) {
      var appendOptions = $(el).data('mobile-append') || {};
      var mobileOptions = $(el).data('mobile-options') || {};
      if (appendOptions) {
        slider.mobileOptions = $.extend(true, slider.options, appendOptions);
      } else if (mobileOptions) {
        slider.mobileOptions = mobileOptions;
      } else {
        slider.mobileOptions = slider.options;
      }
      slider.el = $(this).bxSlider(slider.mobileOptions)
    } else {
      slider.el = $(this).bxSlider(slider.options)
    }
    els[this.id || index] = slider
  });
}

function getElement(index) {
  return els[index]
}

function onSlideAfter($slideElement, oldIndex, newIndex) {
  skrollr.refresh()
}

export default {
  init,
  getElement
}